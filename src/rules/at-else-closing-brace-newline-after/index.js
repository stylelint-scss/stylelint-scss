"use strict";

const isBoolean = require("lodash.isboolean");
const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-else-closing-brace-newline-after");

const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected newline after "}" of @else statement',
  rejected: 'Unexpected newline after "}" of @else statement'
});

const {
  sassConditionalBraceNLAfterChecker
} = require("../at-if-closing-brace-newline-after");

function rule(expectation, options, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["always-last-in-chain"]
      },
      {
        actual: options,
        possible: {
          disableFix: isBoolean
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    sassConditionalBraceNLAfterChecker({
      root,
      result,
      ruleName,
      atRuleName: "else",
      expectation,
      messages,
      context,
      options
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
