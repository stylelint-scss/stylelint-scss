import {
  isAtRule,
  isDeclaration,
  isValueFunction,
  isValueWord
} from "../../utils/typeGuards.js";
import { isDollarVar } from "../../utils/validateTypes.js";
import isNativeCssFunction from "../../utils/isNativeCssFunction.js";
import moduleNamespace from "../../utils/moduleNamespace.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

/** @typedef {import('postcss').Declaration | import('postcss').AtRule} CheckedNode */
/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {{ name: string, start: number, end: number }} Variable */

const { utils } = stylelint;

const ruleName = namespace("dollar-variable-no-missing-interpolation");

const messages = utils.ruleMessages(ruleName, {
  /**
   * @param {string} nodeName
   * @param {string} variableName
   * @returns {string}
   */
  rejected: (nodeName, variableName) =>
    `Expected variable ${variableName} to be interpolated when using it with ${nodeName}`
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
};

const CUSTOM_IDENT_PROPERTIES = [
  "animation",
  "animation-name",
  "counter-reset",
  "counter-increment",
  "list-style-type",
  "will-change"
];

const CUSTOM_IDENT_AT_RULES = ["counter-style", "keyframes", "supports"];

/**
 * @param {CheckedNode} node
 * @returns {boolean}
 */
function isCustomIdentAtRule(node) {
  return isAtRule(node) && CUSTOM_IDENT_AT_RULES.includes(node.name);
}

/**
 * @param {CheckedNode} node
 * @returns {boolean}
 */
function isCustomIdentProp(node) {
  return isDeclaration(node) && CUSTOM_IDENT_PROPERTIES.includes(node.prop);
}

/**
 * @param {CheckedNode} node
 * @returns {boolean}
 */
function isAtSupports(node) {
  return isAtRule(node) && node.name === "supports";
}

/**
 * @param {CheckedNode} node
 * @returns {boolean}
 */
function isCustomProperty(node) {
  return isDeclaration(node) && node.prop.startsWith("--");
}

/**
 * Variables inside #{...} blocks are already interpolated and should not be flagged.
 * Example: "animation-name: #{$bar} $baz" - $bar is interpolated, $baz is not.
 * Handles nested blocks: #{outer(#{inner($var)})}
 * @param {string} value
 * @param {number} variableIndex
 * @returns {boolean}
 */
function isInsideInterpolationBlock(value, variableIndex) {
  let depth = 0;

  // Scan from the start of the value up to the variable position
  for (let i = 0; i < variableIndex; i++) {
    if (value[i] === "#" && value[i + 1] === "{") {
      depth++;
      i++; // Skip the '{' to avoid double-counting
    } else if (value[i] === "}") {
      depth--;
    }
  }

  return depth > 0;
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isSassVariable(value) {
  return value[0] === "$";
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isStringValue(value) {
  return /^["'].*["']$/.test(value);
}

/**
 * @param {Array<import('postcss-value-parser').FunctionNode>} functionStack
 * @returns {import('postcss-value-parser').FunctionNode | undefined}
 */
function findSassFunctionToInterpolate(functionStack) {
  const lastNativeIndex = functionStack.findLastIndex(functionNode =>
    isNativeCssFunction(functionNode.value)
  );

  // Every function after the last native one is a Sass function
  return functionStack[lastNativeIndex + 1];
}

/**
 * Matches `$var` and `ns.$var` inside a word. Namespaces come from `@use`, since
 * they may contain hyphens: `--c-ns.$b` yields `ns.$b`.
 * @param {import('postcss').Root} root
 * @returns {RegExp}
 */
function createVariablePattern(root) {
  /** @type {Array<string>} */
  const namespaces = [];

  root.walkAtRules("use", atRule => {
    const url = atRule.params.match(/^["'](.+?)["']/)?.[1];
    const name = url && moduleNamespace(root, url);

    if (name && /^[\p{L}\p{N}_-]+$/u.test(name)) {
      namespaces.push(name);
    }
  });

  const nameChar = "[\\p{L}\\p{N}_]";
  const prefix = namespaces.length
    ? `(?:(?<!${nameChar})(?:${namespaces.join("|")})\\.)?`
    : "";

  // A name never ends with `-`: `$a-$b` is `$a` and `$b`
  return new RegExp(`${prefix}\\$[\\p{L}\\p{N}_-]*${nameChar}`, "gu");
}

/**
 * Variables in a word that are outside `#{...}`, e.g. `ns.$b` in `--c-#{$a}-ns.$b`.
 * @param {string} value
 * @param {import('postcss-value-parser').Node} node
 * @param {RegExp} variablePattern
 * @returns {Array<Variable>}
 */
function findUninterpolatedVariables(value, node, variablePattern) {
  return [...node.value.matchAll(variablePattern)]
    .map(({ 0: name, index }) => {
      const start = node.sourceIndex + index;

      return { name, start, end: start + name.length };
    })
    .filter(({ start }) => !isInsideInterpolationBlock(value, start));
}

/**
 * @param {string} value
 * @param {RegExp} variablePattern
 * @param {boolean} wrapFunctionCalls
 * @returns {Array<[start: number, end: number]>}
 */
function getInterpolationRanges(value, variablePattern, wrapFunctionCalls) {
  /** @type {Array<[start: number, end: number]>} */
  const ranges = [];

  /**
   * @param {Array<import('postcss-value-parser').Node>} nodes
   * @param {Array<import('postcss-value-parser').FunctionNode>} [functionStack]
   */
  function walkNodes(nodes, functionStack = []) {
    for (const node of nodes) {
      if (isValueWord(node) && isDollarVar(node.value)) {
        for (const { start, end } of findUninterpolatedVariables(
          value,
          node,
          variablePattern
        )) {
          const sassFunction = wrapFunctionCalls
            ? findSassFunctionToInterpolate(functionStack)
            : undefined;

          ranges.push(
            sassFunction
              ? [sassFunction.sourceIndex, sassFunction.sourceEndIndex]
              : [start, end]
          );
        }
      }

      if (isValueFunction(node)) {
        walkNodes(node.nodes, [...functionStack, node]);
      }
    }
  }

  walkNodes(valueParser(value).nodes);

  return ranges;
}

/**
 * Wrap uninterpolated SCSS variables with interpolation syntax.
 * When fixing CSS custom properties, wrap Sass function calls around variables
 * while leaving native CSS functions such as calc() in place.
 * Examples:
 *   "animation-name: $bar" → "animation-name: #{$bar}"
 *   "--foo: variables.$someVariable" → "--foo: #{variables.$someVariable}"
 *   "--icon: svg.encode-svg($icon)" → "--icon: #{svg.encode-svg($icon)}"
 *   "--size: calc($size * 2)" → "--size: calc(#{$size} * 2)"
 * @param {string} value
 * @param {RegExp} variablePattern
 * @param {boolean} [wrapFunctionCalls]
 * @returns {string}
 */
function wrapVariablesWithInterpolation(
  value,
  variablePattern,
  wrapFunctionCalls = false
) {
  let fixed = value;

  // Process ranges in reverse order to maintain correct string indices.
  // If we processed left-to-right, wrapping "$a" would shift the indices
  // for "$b" in a string like "animation: $a 5s, $b 3s".
  for (const [start, end] of getInterpolationRanges(
    value,
    variablePattern,
    wrapFunctionCalls
  ).toReversed()) {
    fixed = `${fixed.slice(0, start)}#{${fixed.slice(start, end)}}${fixed.slice(end)}`;
  }

  return fixed;
}

/**
 * @param {Array<string>} arr
 * @returns {RegExp}
 */
function createMatchingRegex(arr) {
  return new RegExp(`(${arr.join("|")})`);
}

/**
 * Collect all SCSS variables, separating string-valued ones for different reporting rules.
 * @param {import('postcss').Root} root
 * @returns {{ stringValuedVars: Array<string>, allVars: Array<string> }}
 */
function collectVariables(root) {
  /** @type {Array<string>} */
  const stringValuedVars = [];
  /** @type {Array<string>} */
  const allVars = [];

  /**
   * @param {import('postcss').Root | import('postcss').Rule} node
   */
  function findVariablesInNode(node) {
    node.walkDecls(decl => {
      const { prop, value } = decl;

      // Handle dollar variables inside custom properties separately
      // since they need to always be interpolated (unlike plain dollar variables).
      if (
        !allVars.includes(value) &&
        isCustomProperty(decl) &&
        isDollarVar(value)
      ) {
        allVars.push(value);

        return;
      }

      // Skip if not a SCSS variable or already collected
      if (!isSassVariable(prop) || allVars.includes(prop)) {
        return;
      }

      // Track string-valued variables separately
      if (isStringValue(value)) {
        stringValuedVars.push(prop);
      }

      allVars.push(prop);
    });
  }

  // walkDecls already reaches declarations nested in rules
  findVariablesInNode(root);

  return {
    stringValuedVars,
    allVars
  };
}

/**
 * Reporting rules:
 * 1. String-valued variables in custom identifier properties → report
 * 2. String-valued variables in @supports → report
 * 3. All variables in custom identifier at-rules → report
 * 4. All variables in CSS custom properties → report
 * @param {CheckedNode} node
 * @param {string} variableName
 * @param {Array<string>} stringValuedVars
 * @param {Array<string>} allVars
 * @returns {boolean}
 */
function shouldReportVariable(node, variableName, stringValuedVars, allVars) {
  // Custom identifier properties and @supports require string-valued variables
  if (isAtSupports(node) || isCustomIdentProp(node)) {
    return stringValuedVars.includes(variableName);
  }

  // Custom identifier at-rules require all variables to be interpolated
  if (isCustomIdentAtRule(node)) {
    return allVars.includes(variableName);
  }

  // CSS custom properties always require interpolation for all variables,
  // including ones imported via @use/@import (not only same-file decls in allVars).
  // Gate on isDollarVar: bare `true` would false-positive on non-var words (e.g. `2` in calc).
  return isCustomProperty(node) && isDollarVar(variableName);
}

/**
 * @param {CheckedNode} node
 * @param {Variable} variable
 * @param {RegExp} variablePattern
 * @param {PostcssResult} result
 */
function reportViolation(node, variable, variablePattern, result) {
  const nodeName = isAtRule(node) ? `@${node.name}` : node.prop;

  const fix = () => {
    // Apply the fix by wrapping all variables in the value
    if (isAtRule(node)) {
      node.params = wrapVariablesWithInterpolation(
        node.params,
        variablePattern
      );
    } else {
      node.value = wrapVariablesWithInterpolation(
        node.value,
        variablePattern,
        isCustomProperty(node)
      );
    }
  };

  utils.report({
    ruleName,
    result,
    node,
    message: messages.rejected(nodeName, variable.name),
    word: variable.name,
    fix
  });
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {boolean}
 */
function shouldSkipValueNode(node) {
  return !isValueWord(node) || !node.value;
}

/**
 * @param {CheckedNode} node
 * @param {string} value
 * @param {Set<CheckedNode>} reportedNodes
 * @param {Array<string>} stringValuedVars
 * @param {Array<string>} allVars
 * @param {RegExp} variablePattern
 * @param {PostcssResult} result
 */
function checkValueForVariables(
  node,
  value,
  reportedNodes,
  stringValuedVars,
  allVars,
  variablePattern,
  result
) {
  // Skip if we've already reported this node
  if (reportedNodes.has(node)) {
    return;
  }

  /** @type {Variable | undefined} */
  let firstViolatingVariable;

  // Parse the value and check each word token
  valueParser(value).walk(valueNode => {
    const { value: tokenValue } = valueNode;

    if (
      shouldSkipValueNode(valueNode) ||
      !shouldReportVariable(node, tokenValue, stringValuedVars, allVars)
    ) {
      return;
    }

    // Check each variable, not the whole word: `--c-#{ns.$b}` is one word (#1403)
    firstViolatingVariable ??= findUninterpolatedVariables(
      value,
      valueNode,
      variablePattern
    )[0];
  });

  // Only report once per node, using the first variable found
  if (firstViolatingVariable) {
    reportedNodes.add(node);
    reportViolation(node, firstViolatingVariable, variablePattern, result);
  }
}

/**
 * Check for SCSS variables that need interpolation in:
 * 1. String-valued variables with custom identifier properties (animation-name, counter-reset, etc.)
 * 2. All variables in custom identifier at-rules (@keyframes, @counter-style)
 * 3. String-valued variables in @supports with custom identifier properties
 * 4. All variables in CSS custom properties (--*)
 * @param {boolean} actual
 * @returns {(root: import('postcss').Root, result: PostcssResult) => void}
 */
function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    // Collect all SCSS variables defined in the stylesheet
    const { stringValuedVars, allVars } = collectVariables(root);

    // Track nodes we've already reported to avoid duplicates
    /** @type {Set<CheckedNode>} */
    const reportedNodes = new Set();
    const variablePattern = createVariablePattern(root);

    // Check all CSS custom properties (--*) before the allVars early-exit.
    // Imported vars (@use/@import) are absent from allVars; custom-prop reporting
    // must still run for `@use`-only stylesheets (issue #1361).
    root.walkDecls(decl => {
      if (isCustomProperty(decl)) {
        checkValueForVariables(
          decl,
          decl.value,
          reportedNodes,
          stringValuedVars,
          allVars,
          variablePattern,
          result
        );
      }
    });

    // Remaining walks need same-file collected vars; skip if none
    if (allVars.length === 0) {
      return;
    }

    // Check custom identifier properties (animation-name, counter-reset, etc.)
    root.walkDecls(createMatchingRegex(CUSTOM_IDENT_PROPERTIES), decl => {
      checkValueForVariables(
        decl,
        decl.value,
        reportedNodes,
        stringValuedVars,
        allVars,
        variablePattern,
        result
      );
    });

    // Check custom identifier at-rules (@keyframes, @counter-style, @supports)
    root.walkAtRules(createMatchingRegex(CUSTOM_IDENT_AT_RULES), atRule => {
      checkValueForVariables(
        atRule,
        atRule.params,
        reportedNodes,
        stringValuedVars,
        allVars,
        variablePattern,
        result
      );
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
