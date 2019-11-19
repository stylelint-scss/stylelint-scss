"use strict";

const { namespace, whitespaceChecker } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-function-parentheses-space-before");

const messages = utils.ruleMessages(ruleName, {
  rejectedBefore: () =>
    "Unexpected whitespace before parentheses in function declaration",
  expectedBefore: () =>
    "Expected a single space before parentheses in function declaration"
});

function rule(value, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    const match = /^([\w-]+)\s*?\(/;
    const replacement = value === "always" ? "$1 (" : "$1(";

    const checker = whitespaceChecker("space", value, messages).before;

    root.walkAtRules("function", decl => {
      if (context.fix) {
        decl.params = decl.params.replace(match, replacement);

        return;
      }

      checker({
        source: decl.params,
        index: decl.params.indexOf("("),
        err: message => utils.report({ message, node: decl, result, ruleName })
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
