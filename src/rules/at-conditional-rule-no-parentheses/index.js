import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-conditional-rule-no-parentheses");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Do not use () to surround statements for @-rules"
});

// postcss picks up else-if as else.
const conditional_rules = ["if", "while", "else"];

function report(atrule, result) {
  utils.report({
    message: messages.rejected,
    node: atrule,
    result,
    ruleName
  });
}

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

      // Else uses a different regex
      // params are of format "`if (cond)` or `if cond`
      // instead of `(cond)` or `cond`"
      if (atrule.name === "else") {
        if (atrule.params.match(/ ?if ?\(.*\) ?/)) {
          report(atrule, result);
        }
      } else {
        if (atrule.params.match(/ ?\(.*\) ?/)) {
          report(atrule, result);
        }
      }
    });
  };
}
