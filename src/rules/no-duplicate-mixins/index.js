"use strict";

const { utils } = require("stylelint");
const atRuleBaseName = require("../../utils/atRuleBaseName");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

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

    const mixins = {};

    root.walkAtRules("mixin", atRule => {
      const mixinName = atRuleBaseName(atRule);

      if (mixins[mixinName]) {
        utils.report({
          message: messages.rejected(mixinName),
          node: atRule,
          result,
          ruleName,
          word: mixinName
        });
      }

      mixins[mixinName] = true;
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
