import { utils } from "stylelint";
import { namespace, parseSelector } from "../../utils";
import { isClassName, isCombinator } from "postcss-selector-parser";

export const ruleName = namespace("selector-no-union-class-name");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Union class name detected"
});

export default function(actual) {
  return function(root, result) {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkRules(/&/, rule => {
      const parentNodes = [];

      parseSelector(rule.parent.selector, result, rule, fullSelector => {
        fullSelector.walk(node => parentNodes.push(node));
      });

      const lastParentNode = parentNodes[parentNodes.length - 1];

      if (!isClassName(lastParentNode)) return;

      parseSelector(rule.selector, result, rule, fullSelector => {
        fullSelector.walkNesting(node => {
          const next = node.next();

          if (!next) return;

          if (isCombinator(next)) return;

          if (isClassName(next)) return;

          utils.report({
            ruleName,
            result,
            node: rule,
            message: messages.rejected,
            index: node.sourceIndex
          });
        });
      });
    });
  };
}
