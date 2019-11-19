"use strict";

const { atRuleBaseName, namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("no-duplicate-mixins");

const messages = utils.ruleMessages(ruleName, {
  rejected: mixin => `Unexpected duplicate mixin ${mixin}`
});

function rule(value) {
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

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
