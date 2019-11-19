"use strict";

const { eachRoot, findCommentsInRaws, namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("double-slash-comment-whitespace-inside");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected a space after //",
  rejected: "Unexpected space after //"
});

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });

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

        // if it's `//` - no warning whatsoever; if `// ` - then trailing
        // whitespace rule will govern this
        if (comment.text === "") {
          return;
        }

        let message;

        if (expectation === "never" && comment.raws.left !== "") {
          message = messages.rejected;
        } else if (comment.raws.left === "" && expectation === "always") {
          message = messages.expected;
        } else {
          return;
        }

        utils.report({
          message,
          node: root,
          index: comment.source.start + comment.raws.startToken.length,
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
