"use strict";

const { utils } = require("stylelint");
const atRuleParamIndex = require("../../utils/atRuleParamIndex");
const whitespaceChecker = require("../../utils/whitespaceChecker");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("at-mixin-parentheses-space-before");

const messages = utils.ruleMessages(ruleName, {
  rejectedBefore: () =>
    "Unexpected whitespace before parentheses in mixin declaration",
  expectedBefore: () =>
    "Expected a single space before parentheses in mixin declaration"
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(value, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    const match = /^([\w-]+)\s*\(/;
    const replacement = value === "always" ? "$1 (" : "$1(";

    const checker = whitespaceChecker("space", value, messages).before;

    root.walkAtRules("mixin", atRule => {
      if (context.fix) {
        atRule.params = atRule.params.replace(match, replacement);

        return;
      }

      const parenIndex = atRule.params.indexOf("(");
      const baseIndex = atRuleParamIndex(atRule);

      checker({
        source: atRule.params,
        index: parenIndex,
        err: message =>
          utils.report({
            message,
            node: atRule,
            result,
            ruleName,
            index: baseIndex + parenIndex
          })
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
