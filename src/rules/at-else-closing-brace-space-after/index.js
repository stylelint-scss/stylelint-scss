"use strict";

const {
  sassConditionalBraceSpaceAfterChecker
} = require("../at-if-closing-brace-space-after");
const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-else-closing-brace-space-after");

const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected single space after "}" of @else statement',
  rejected: 'Unexpected space after "}" of @else statement'
});

function rule(expectation, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always-intermediate", "never-intermediate"]
    });

    if (!validOptions) {
      return;
    }

    sassConditionalBraceSpaceAfterChecker({
      root,
      result,
      ruleName,
      atRuleName: "else",
      expectation,
      messages,
      context
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
