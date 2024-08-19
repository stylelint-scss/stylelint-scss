"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("load-no-redundant-path");

const messages = utils.ruleMessages(ruleName, {
  rejected: path => `Redundant "./" in path "${path}"`
});

const meta = {
  url: ruleUrl(ruleName)
};
const loadAtRules = ["import", "use", "forward"];

function rule(actual, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atRule => {
      if (
        (loadAtRules.includes(atRule.name) &&
          atRule.params.startsWith('"./')) ||
        atRule.params.includes("/./")
      ) {
        if (context.fix) {
          atRule.params = atRule.params.replace("./", "");
          return;
        }
        utils.report({
          message: messages.rejected(atRule.params),
          node: atRule,
          result,
          ruleName
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
