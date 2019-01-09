import { utils } from "stylelint";
import { namespace, parseSelector } from "../../utils";

export const ruleName = namespace("selector-nest-combinators");

export const messages = utils.ruleMessages(ruleName, {
  expected: prop => `Expected selector "${prop}" to be in a nested form`,
  rejected: prop => `Unexpected "${prop}" found in selector`
});

export default function(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    root.walkRules(rule => {
      parseSelector(rule.selector, result, rule, fullSelector => {
        // attribute, class, combinator, comment, id, nesting, pseudo, root, selector, string, tag, or universal
        const chainingTypes = [
          "attribute",
          "class",
          "id",
          "pseudo",
          "tag",
          "universal"
        ];

        fullSelector.walk(node => {
          if (expectation === "always") {
            if (node.type === "selector") {
              return;
            }

            if (
              node.parent &&
              node.parent.type === "selector" &&
              node.parent.parent &&
              node.parent.parent.type === "pseudo"
            ) {
              return;
            }

            if (!node.prev()) {
              return;
            }

            if (node.next() && precedesParentSelector(node)) {
              return;
            }

            if (!chainingTypes.includes(node.type)) {
              return;
            }

            if (node.prev().type === "combinator") {
              if (!node.prev().prev()) {
                return;
              }

              if (!chainingTypes.includes(node.prev().prev().type)) {
                return;
              }
            }

            if (
              node.prev().type !== "combinator" &&
              chainingTypes.includes(node.type) &&
              !chainingTypes.includes(node.prev().type)
            ) {
              return;
            }
          }

          if (expectation === "never") {
            if (rule.parent.type === "root" || rule.parent.type === "atrule") {
              return;
            }
          }

          utils.report({
            ruleName,
            result,
            node: rule,
            message: messages.rejected,
            index: node.sourceIndex
          });

          function precedesParentSelector(current) {
            do {
              current = current.next();

              if (current.type === "nesting") {
                return true;
              }
            } while (current.next());

            return false;
          }
        });
      });
    });
  };
}
