"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace.js");
const ruleUrl = require("../../utils/ruleUrl.js");

const ruleName = namespace("at-if-no-null");

const messages = utils.ruleMessages(ruleName, {
  equalsNull: "Expected @if not statement rather than @if statement == null",
  notEqualsNull: "Expected @if statement rather than @if statement != null"
});

const meta = {
  url: ruleUrl(ruleName)
};

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
      if (atrule.params.match(/.* != null and .*/)) {
        return;
      }

      if (atrule.params.match(/.* == null[ \t]*\)?/)) {
        utils.report({
          message: messages.equalsNull,
          node: atrule,
          result,
          ruleName
        });
      } else if (atrule.params.match(/.* != null[ \t]*\)?/)) {
        utils.report({
          message: messages.notEqualsNull,
          node: atrule,
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
