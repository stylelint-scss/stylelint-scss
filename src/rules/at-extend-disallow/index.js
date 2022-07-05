import { utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";

export const ruleName = namespace("at-extend-disallow");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "@extend declarations are not permitted"
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("extend", atrule => {
      utils.report({
        ruleName,
        result,
        node: atrule,
        message: messages.rejected
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
