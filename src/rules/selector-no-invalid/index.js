import { parse, walk } from "css-tree";
import hasInterpolation from "../../utils/hasInterpolation.js";
import { isAtRule } from "../../utils/typeGuards.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

/** @import { CssNode, PseudoClassSelector, PseudoElementSelector, Selector } from "css-tree" */

const { utils } = stylelint;

const ruleName = namespace("selector-no-invalid");

const messages = utils.ruleMessages(ruleName, {
  /**
   * @param {string} selector
   * @param {string} reason
   */
  rejected: (selector, reason) => `Invalid selector "${selector}", ${reason}`
});

const meta = {
  url: ruleUrl(ruleName)
};

// See https://drafts.csswg.org/selectors/#typedef-forgiving-selector-list
const unforgivingArgumentPseudos = new Set([
  "has",
  "host",
  "not",
  "nth-child",
  "nth-last-child",
  "slotted"
]);

// See https://drafts.csswg.org/selectors/#sub-pseudo-elements
const elementBackedPseudoElements = new Set([
  "details-content",
  "file-selector-button",
  "part"
]);
const subPseudoElements = new Set(["marker", "scroll-marker"]);

/** @type {import("stylelint").Rule<true>} */
const rule = primary => (root, result) => {
  if (!utils.validateOptions(result, ruleName, { actual: primary })) return;

  root.walkRules(ruleNode => {
    const { parent } = ruleNode;

    if (parent && isAtRule(parent) && /keyframes$/i.test(parent.name)) return;

    // postcss-scss rewrites `//` comments in `raw`, but keeps the source in `scss`
    /** @type {{ raw: string, scss?: string } | undefined} */
    const raws = ruleNode.raws.selector;
    const selector = raws?.scss || raws?.raw || ruleNode.selector;

    // Interpolation can't be checked, and a trailing `:` is a nested property
    if (hasInterpolation(selector) || selector.endsWith(":")) return;

    /**
     * @param {string} reason
     * @param {number} index
     * @param {number} endIndex
     * @param {string} [subject]
     */
    const complain = (
      reason,
      index,
      endIndex,
      subject = selector.slice(index, endIndex)
    ) =>
      utils.report({
        message: messages.rejected,
        messageArgs: [subject, reason],
        node: ruleNode,
        index,
        endIndex,
        ruleName,
        result
      });

    let ast;

    try {
      ast = parse(toStandardSelector(selector), {
        context: "selectorList",
        positions: true
      });
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;

      const offset =
        "offset" in error && typeof error.offset === "number"
          ? error.offset
          : 0;
      const reason =
        error.message.charAt(0).toLowerCase() + error.message.slice(1);

      complain(reason, offset, Math.min(offset + 1, selector.length), selector);

      return;
    }

    if (ast.type !== "SelectorList") return;

    for (const selectorNode of ast.children) {
      if (selectorNode.type !== "Selector" || !selectorNode.loc) continue;

      const { start, end } = selectorNode.loc;

      for (const reason of findProblems(selectorNode)) {
        complain(reason, start.offset, end.offset);
      }
    }
  });
};

/**
 * Rewrites Sass-only syntax to standard CSS of the same length, so offsets still match the source:
 * `//` comments become spaces, `%placeholder` becomes `.placeholder`, and `&-suffix` becomes `&xxxxxxx`.
 *
 * @param {string} selector
 * @returns {string}
 */
function toStandardSelector(selector) {
  return selector.replace(
    /\\.|(["'])(?:\\.|(?!\1)[^\\])*\1|\/\*[\s\S]*?\*\/|\/\/.*|%(?=[\w-])|&[\w-]+/g,
    match => {
      if (match.startsWith("//")) return " ".repeat(match.length);

      if (match === "%") return ".";

      if (match.startsWith("&")) return "&".padEnd(match.length, "x");

      return match;
    }
  );
}

/**
 * @param {Selector} selector
 * @returns {string[]}
 */
function findProblems(selector) {
  const problems = [checkTopLevel(selector)];

  walk(selector, node => {
    if (
      node.type === "PseudoClassSelector" ||
      node.type === "PseudoElementSelector"
    ) {
      problems.push(checkPseudo(node));
    }
  });

  return problems.filter(problem => problem !== undefined);
}

/**
 * @param {PseudoClassSelector | PseudoElementSelector} node
 * @returns {string | undefined}
 */
function checkPseudo(node) {
  const name = node.name.toLowerCase();
  const pseudo = formatPseudo(node);
  const argument = node.children?.first;

  if (name === "dir" && node.type === "PseudoClassSelector") {
    const isValid =
      node.children?.size === 1 &&
      argument?.type === "Identifier" &&
      /^(?:ltr|rtl)$/i.test(argument.name);

    return isValid ? undefined : `expected "ltr" or "rtl" within "${pseudo}"`;
  }

  if (!unforgivingArgumentPseudos.has(name)) return undefined;

  // Functional pseudo-classes inside are checked on their own
  if (
    hasDescendant(
      node,
      child => child.type === "PseudoElementSelector",
      child => child.type === "PseudoClassSelector" && child.children !== null
    )
  ) {
    return `pseudo-elements are invalid within "${pseudo}"`;
  }

  if (
    name === "has" &&
    hasDescendant(
      node,
      child =>
        child.type === "PseudoClassSelector" &&
        child.name.toLowerCase() === "has"
    )
  ) {
    return '":has()" is invalid within ":has()"';
  }

  // See https://drafts.csswg.org/css-shadow-1/
  if (
    (name === "host" || name === "slotted") &&
    argument?.type === "Selector" &&
    argument.children.some(child => child.type === "Combinator")
  ) {
    return `combinators are invalid within "${pseudo}"`;
  }

  return undefined;
}

/**
 * Combinators and most pseudo-elements are invalid after a pseudo-element;
 * see https://drafts.csswg.org/selectors/#pseudo-element-structure
 *
 * @param {Selector} selector
 * @returns {string | undefined}
 */
function checkTopLevel(selector) {
  // The parent selector may itself end with a pseudo-element
  if (selector.children.some(node => node.type === "NestingSelector")) {
    return undefined;
  }

  /** @type {PseudoElementSelector | undefined} */
  let lastPseudoElement;
  /** @type {CssNode | undefined} */
  let previous;

  for (const node of selector.children) {
    if (node.type === "Combinator" && lastPseudoElement) {
      return `combinators are invalid after "${formatPseudo(lastPseudoElement)}"`;
    }

    if (node.type === "PseudoElementSelector") {
      if (
        previous?.type === "PseudoElementSelector" &&
        !elementBackedPseudoElements.has(previous.name.toLowerCase()) &&
        !subPseudoElements.has(node.name.toLowerCase())
      ) {
        return `"${formatPseudo(node)}" is invalid after "${formatPseudo(previous)}"`;
      }

      lastPseudoElement = node;
    }

    previous = node;
  }

  return undefined;
}

/**
 * @param {CssNode} container
 * @param {(node: CssNode) => boolean} match
 * @param {(node: CssNode) => boolean} [skip] Whether to skip a node's children
 * @returns {boolean}
 */
function hasDescendant(container, match, skip = () => false) {
  let found = false;

  walk(container, node => {
    if (node === container) return undefined;

    if (match(node)) {
      found = true;

      return walk.break;
    }

    return skip(node) ? walk.skip : undefined;
  });

  return found;
}

/**
 * @param {PseudoClassSelector | PseudoElementSelector} node
 * @returns {string}
 */
function formatPseudo(node) {
  const colons = node.type === "PseudoElementSelector" ? "::" : ":";

  return `${colons}${node.name.toLowerCase()}${node.children === null ? "" : "()"}`;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
