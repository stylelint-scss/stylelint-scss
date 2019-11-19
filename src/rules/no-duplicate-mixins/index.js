import { utils } from "stylelint";
import { atRuleBaseName, namespace } from "../../utils";

export const ruleName = namespace("no-duplicate-mixins");

export const messages = utils.ruleMessages(ruleName, {
  rejected: mixin => `Unexpected duplicate mixin ${mixin}`
});

export default function(value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value
    });

    if (!validOptions) {
      return;
    }

    const mixins = {};

    root.walkAtRules(decl => {
      const isMixin = decl.name === "mixin";

      if (!isMixin) {
        return;
      }

      const mixinName = atRuleBaseName(decl);

      if (mixins[mixinName]) {
        utils.report({
          message: messages.rejected(mixinName),
          node: decl,
          result,
          ruleName
        });
      }

      mixins[mixinName] = true;
    });
  };
}
