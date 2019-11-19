"use strict";

const {
  eachRoot,
  findCommentsInRaws,
  namespace,
  optionsHaveIgnored
} = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("double-slash-comment-inline");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected //-comment to be inline comment",
  rejected: "Unexpected inline //-comment"
});

const stylelintCommandPrefix = "stylelint-";

function rule(expectation, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["always", "never"]
      },
      {
        actual: options,
        possible: {
          ignore: ["stylelint-commands"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    eachRoot(root, checkRoot);

    function checkRoot(root) {
      const rootString = root.source.input.css;

      if (rootString.trim() === "") {
        return;
      }

      const comments = findCommentsInRaws(rootString);

      comments.forEach(comment => {
        // Only process // comments
        if (comment.type !== "double-slash") {
          return;
        }

        // Optionally ignore stylelint commands
        if (
          comment.text.indexOf(stylelintCommandPrefix) === 0 &&
          optionsHaveIgnored(options, "stylelint-commands")
        ) {
          return;
        }

        const isInline = comment.inlineAfter || comment.inlineBefore;
        let message;

        if (isInline && expectation === "never") {
          message = messages.rejected;
        } else if (!isInline && expectation === "always") {
          message = messages.expected;
        } else {
          return;
        }

        utils.report({
          message,
          node: root,
          index: comment.source.start,
          result,
          ruleName
        });
      });
    }
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
