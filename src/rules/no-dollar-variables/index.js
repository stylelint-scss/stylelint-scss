"use strict";

const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("no-dollar-variables");

const messages = utils.ruleMessages(ruleName, {
  rejected: variable => `Unexpected dollar variable ${variable}`
});

function rule(value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      if (decl.prop[0] !== "$") {
        return;
      }

      utils.report({
        message: messages.rejected(decl.prop),
        node: decl,
        result,
        ruleName
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
