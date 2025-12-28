import stylelint from "stylelint";
import atRuleBaseName from "../../utils/atRuleBaseName.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("no-duplicate-mixins");

const messages = utils.ruleMessages(ruleName, {
  rejected: mixin => `Unexpected duplicate mixin ${mixin}`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value
    });

    if (!validOptions) {
      return;
    }

    let mixins = {};

    root.walkAtRules("mixin", atRule => {
      const mixinName = atRuleBaseName(atRule);

      if (mixins[mixinName]) {
        const areInDifferentScopes =
          mixins[mixinName].parent !== atRule.parent &&
          mixins[mixinName].parent.type !== "root" &&
          atRule.parent.type !== "root";

        if (areInDifferentScopes) {
          return;
        }

        utils.report({
          message: messages.rejected(mixinName),
          node: atRule,
          result,
          ruleName,
          word: mixinName
        });
        // cleanup after reporting
        delete mixins[mixinName];
      }

      mixins[mixinName] = {
        parent: atRule.parent
      };
    });

    // cleanup after walking mixins
    mixins = {};
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
