import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-conditional-rule-no-parentheses");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Do not use () to surround statements for @-rules"
});

const conditional_rules = ["if", "while", "else if"];

export default function(primary) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atrule => {
      // Check if this is a conditional rule.
      if (!conditional_rules.includes(atrule.name)) {
        return;
      }

      if (atrule.params.match(/ ?\(.*\) ?/)) {
        utils.report({
          message: messages.rejected,
          node: atrule,
          result,
          ruleName
        });
      }
    });
  };
}
