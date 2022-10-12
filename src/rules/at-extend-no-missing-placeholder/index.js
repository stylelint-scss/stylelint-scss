import { utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";

export const ruleName = namespace("at-extend-no-missing-placeholder");

export const messages = utils.ruleMessages(ruleName, {
  rejected:
    "Expected a placeholder selector (e.g. %placeholder) to be used in @extend",
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

    root.walkAtRules("extend", (atrule) => {
      const isPlaceholder = atrule.params.trim()[0] === "%";
      const isInterpolation = /^#{.+}/.test(atrule.params.trim());

      if (!isPlaceholder && !isInterpolation) {
        utils.report({
          ruleName,
          result,
          node: atrule,
          message: messages.rejected,
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
