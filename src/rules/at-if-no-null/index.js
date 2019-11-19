"use strict";

const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-if-no-null");

const messages = utils.ruleMessages(ruleName, {
  equals_null: "Expected @if not statement rather than @if statement == null",
  not_equals_null: "Expected @if statement rather than @if statement != null"
});

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atrule => {
      // Do nothing if it's not an @if
      if (atrule.name !== "if") {
        return;
      }

      // If rule != null and (expr), skip
      if (atrule.params.match(/\(?[ \t]*.* != null and .*\)?/)) {
        return;
      }

      if (atrule.params.match(/\(?[ \t]*.* == null[ \t]*\)?/)) {
        utils.report({
          message: messages.equals_null,
          node: atrule,
          result,
          ruleName
        });
      } else if (atrule.params.match(/\(?[ \t]*.* != null[ \t]*\)?/)) {
        utils.report({
          message: messages.not_equals_null,
          node: atrule,
          result,
          ruleName
        });
      }
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
