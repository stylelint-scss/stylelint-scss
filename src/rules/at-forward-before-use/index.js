import { utils } from "stylelint";
import { namespace, isNativeCssFunction } from "../../utils";
import valueParser from "postcss-value-parser";

export const ruleName = namespace("at-forward-before-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Forward function should be used before use function"
});

function rule(primary, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    let forwardRules = [];

    root.walkAtRules(/forward|use/, decl => {
      if (decl.name == "forward") {
        forwardRules.push(decl.params.replace('"', ""));
      } else {
        if (!forwardRules.includes(decl.params.replace('"', ""))) {
          utils.report({
            message: messages.rejected,
            node: decl,
            result,
            ruleName
          });
        }
      }
    });
  };
}

export default rule;
