"use strict";

const { namespace, whitespaceChecker } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-else-if-parentheses-space-before");

const messages = utils.ruleMessages(ruleName, {
  rejectedBefore: () =>
    "Unexpected whitespace before parentheses in else-if declaration",
  expectedBefore: () =>
    "Expected a single space before parentheses in else-if declaration"
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

    const match = /^if\s*?\(/;
    const replacement = value === "always" ? "if (" : "if(";

    const checker = whitespaceChecker("space", value, messages).before;

    root.walkAtRules("else", decl => {
      // return early if the else-if statement is not surrounded by parentheses
      if (!match.test(decl.params)) {
        return;
      }

      if (context.fix) {
        decl.params = decl.params.replace(match, replacement);
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
