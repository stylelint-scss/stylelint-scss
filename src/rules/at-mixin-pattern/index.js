"use strict";

const isRegExp = require("lodash.isregexp");
const isString = require("lodash.isstring");
const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-mixin-pattern");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected @mixin name to match specified pattern"
});

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
      if (decl.name !== "mixin") {
        return;
      }

      // Stripping the mixin of its arguments
      const mixinName = decl.params.replace(/(\s*?)\((?:\s|\S)*\)/g, "");

      if (regexpPattern.test(mixinName)) {
        return;
      }

      utils.report({
        message: messages.expected,
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
