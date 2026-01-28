import namespace from "../../utils/namespace.js";
import parseSelector from "../../utils/parseSelector.js";
import ruleUrl from "../../utils/ruleUrl.js";
import selectorParser from "postcss-selector-parser";
import stylelint from "stylelint";

const { utils } = stylelint;
const {
  isAttribute,
  isClassName,
  isCombinator,
  isIdentifier,
  isPseudoClass,
  isPseudoElement
} = selectorParser;

const ruleName = namespace("selector-no-union-class-name");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected union class name with the parent selector (&)"
});

const meta = {
  url: ruleUrl(ruleName)
};

const validNestingTypes = [
  isClassName,
  isCombinator,
  isAttribute,
  isIdentifier,
  isPseudoClass,
  isPseudoElement
];

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkRules(/&/, ruleNode => {
      const parentNodes = [];

      const selector = getSelectorFromRule(ruleNode.parent);

      if (selector) {
        parseSelector(selector, result, ruleNode, fullSelector => {
          fullSelector.walk(node => parentNodes.push(node));
        });
      }

      if (parentNodes.length === 0) return;

      const lastParentNode = parentNodes[parentNodes.length - 1];

      if (!isClassName(lastParentNode)) return;

      parseSelector(ruleNode.selector, result, ruleNode, fullSelector => {
        fullSelector.walkNesting(node => {
          const next = node.next();

          if (!next) return;

          if (validNestingTypes.some(isType => isType(next))) return;

          utils.report({
            ruleName,
            result,
            node: ruleNode,
            message: messages.rejected,
            index: node.sourceIndex,
            endIndex: node.sourceIndex + ruleNode.selector.length
          });
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

/**
 * Searches for the closest rule which
 * has a selector and returns the selector
 * @returns {string|undefined}
 */
function getSelectorFromRule(node) {
  // All non at-rules have their own selector
  if (node.selector !== undefined) {
    return node.selector;
  }

  // At-rules like @mixin don't have a selector themself
  // but their parents might have one
  if (node.parent) {
    return getSelectorFromRule(node.parent);
  }
}

export default rule;
