import { utils } from "stylelint";
import {
  namespace,
  parseSelector,
  hasNestedSibling,
  isKeyword
} from "../../utils";

export const ruleName = namespace("selector-no-redundant-nesting-selector");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unnecessary nesting selector (&)"
});

export default function(actual, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    const { ignoreKeywords = [] } = options || {};

    root.walkRules(/&/, rule => {
      parseSelector(rule.selector, result, rule, fullSelector => {
        // "Ampersand followed by a combinator followed by non-combinator non-ampersand and not the selector end"
        fullSelector.walkNesting(node => {
          const prev = node.prev();

          if (prev || hasNestedSibling(node)) {
            return;
          }

          const next = node.next();

          if (!next && node.parent.parent.nodes.length > 1) {
            return;
          }

          if (next && next.type !== "combinator") {
            return;
          }

          const nextNext = next ? next.next() : null;

          if (
            (nextNext && nextNext.type === "combinator") ||
            isKeyword(nextNext, ignoreKeywords)
          ) {
            return;
          }

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
