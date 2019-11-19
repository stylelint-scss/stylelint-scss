"use strict";

const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-extend-no-missing-placeholder");

const messages = utils.ruleMessages(ruleName, {
  rejected:
    "Expected a placeholder selector (e.g. %placeholder) to be used in @extend"
});

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("extend", atrule => {
      const isPlaceholder = atrule.params.trim()[0] === "%";
      const isInterpolation = /^#{.+}/.test(atrule.params.trim());

      if (!isPlaceholder && !isInterpolation) {
        utils.report({
          ruleName,
          result,
          node: atrule,
          message: messages.rejected
        });
      }
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
