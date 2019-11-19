"use strict";

const { hasEmptyLine, namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-else-empty-line-before");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected empty line before @else"
});

function rule(expectation, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["never"]
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atrule => {
      if (atrule.name !== "else") {
        return;
      }

      // Don't need to ignore "the first rule in a stylesheet", etc, cases
      // because @else should always go after @if

      if (!hasEmptyLine(atrule.raws.before)) {
        return;
      }

      if (context.fix) {
        atrule.raws.before = " ";

        return;
      }

      utils.report({
        message: messages.rejected,
        node: atrule,
        result,
        ruleName
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
