"use strict";

const {
  variableColonSpaceChecker
} = require("../dollar-variable-colon-space-after");
const { namespace, whitespaceChecker } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("dollar-variable-colon-space-before");

const messages = utils.ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ":"',
  rejectedBefore: () => 'Unexpected whitespace before ":"'
});

function rule(expectation, _, context) {
  const checker = whitespaceChecker("space", expectation, messages);

  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    variableColonSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
      position: "before",
      expectation,
      context
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
