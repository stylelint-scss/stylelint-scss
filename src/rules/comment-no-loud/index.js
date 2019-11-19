"use strict";

const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("comment-no-loud");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected // for comments instead of /*"
});

function rule(primary) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walkComments(comment => {
      if (isLoudComment(comment)) {
        utils.report({
          message: messages.expected,
          node: comment,
          result,
          ruleName
        });
      }
    });
  };
}

function isLoudComment(comment) {
  const regex = new RegExp(/^[ \t\n]*\/\*/);

  return regex.test(comment.source.input.css);
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
