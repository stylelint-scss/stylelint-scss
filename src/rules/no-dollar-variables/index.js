import { utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";

export const ruleName = namespace("no-dollar-variables");

export const messages = utils.ruleMessages(ruleName, {
  rejected: variable => `Unexpected dollar variable ${variable}`
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      if (decl.prop[0] !== "$") {
        return;
      }

      utils.report({
        message: messages.rejected(decl.prop),
        node: decl,
        result,
        ruleName
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
