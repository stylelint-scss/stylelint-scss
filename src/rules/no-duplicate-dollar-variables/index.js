import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("no-duplicate-dollar-variables");

export const messages = utils.ruleMessages(ruleName, {
  rejected: variable => `Unexpected duplicate dollar variable ${variable}`
});

export default function(value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value
    });

    if (!validOptions) {
      return;
    }

    const vars = {};

    root.walkDecls(decl => {
      if (decl.prop[0] !== "$") {
        return;
      }

      if (vars[decl.prop]) {
        utils.report({
          message: messages.rejected(decl.prop),
          node: decl,
          result,
          ruleName
        });
      }

      vars[decl.prop] = true;
    });
  };
}
