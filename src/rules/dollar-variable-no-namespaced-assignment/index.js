import { utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";

export const ruleName = namespace("dollar-variable-no-namespaced-assignment");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected assignment to a namespaced $ variable",
});

export const meta = {
  url: ruleUrl(ruleName),
};

export default function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkDecls((decl) => {
      if (!/^[^$.]+\.\$./.test(decl.prop)) {
        return;
      }

      utils.report({
        message: messages.rejected,
        node: decl,
        result,
        ruleName,
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
