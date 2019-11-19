"use strict";

const { utils } = require("stylelint");
const { isRegExp, isString } = require("../../utils/validateTypes");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("at-function-pattern");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected @function name to match specified pattern"
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(pattern) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: pattern,
      possible: [isRegExp, isString]
    });

    if (!validOptions) {
      return;
    }

    const regexpPattern = isString(pattern) ? new RegExp(pattern) : pattern;

    root.walkAtRules(decl => {
      if (decl.name !== "function") {
        return;
      }

      // Stripping the function of its arguments
      const funcName = decl.params.replace(/(\s*)\([\s\S]*\)/g, "");

      if (regexpPattern.test(funcName)) {
        return;
      }

      const funcTopLine = Object.assign({}, decl.source.start);
      funcTopLine.line += 1;
      funcTopLine.column = 0;

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
        end: funcTopLine
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
