import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("selector-no-redundant-nesting-selector");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unnecessary nesting selector (&)"
});

export default function(actual) {
  return function(root, result) {
    const validOptions = utils.validateOptions(result, ruleName, { actual });
    if (!validOptions) {
      return;
    }

    root.walkRules(/&/, rule => {
      const { selector } = rule;
      // "Ampersand followed by a combinator followed by non-combinator non-ampersand and not the selector end"
      const regex = /^&\s*[>+~ ]\s*[^>+~ {&]+/;

      if (selector === "&" || regex.test(selector)) {
        utils.report({
          ruleName,
          result,
          node: rule,
          message: messages.rejected
        });
      }
    });
  };
}
