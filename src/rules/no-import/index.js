"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleToCheckAgainst = "no-import";

const ruleName = namespace(ruleToCheckAgainst);

const messages = utils.ruleMessages(ruleName, {
  rejected: atRule => `Unexpected deprecated at-rule "${atRule}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(on) {
  return async (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: on
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("import", mixinCall => {
      utils.report({
        message: messages.rejected(mixinCall.toString()),
        node: mixinCall,
        result,
        ruleName
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
