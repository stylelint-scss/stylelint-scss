"use strict";

const { utils } = require("stylelint");
const eachRoot = require("../../utils/eachRoot.js");
const findCommentsInRaws = require("../../utils/findCommentsInRaws.js");
const namespace = require("../../utils/namespace.js");
const optionsHaveIgnored = require("../../utils/optionsHaveIgnored.js");
const ruleUrl = require("../../utils/ruleUrl.js");

const ruleName = namespace("double-slash-comment-inline");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected //-comment to be inline comment",
  rejected: "Unexpected inline //-comment"
});

const meta = {
  url: ruleUrl(ruleName)
};

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

      for (const comment of comments) {
        // Only process // comments
        if (comment.type !== "double-slash") {
          continue;
        }

        // Optionally ignore stylelint commands
        if (
          comment.text.indexOf(stylelintCommandPrefix) === 0 &&
          optionsHaveIgnored(options, "stylelint-commands")
        ) {
          continue;
        }

        const isInline = comment.inlineAfter || comment.inlineBefore;
        let message;

        if (isInline && expectation === "never") {
          message = messages.rejected;
        } else if (!isInline && expectation === "always") {
          message = messages.expected;
        } else {
          continue;
        }

        utils.report({
          message,
          node: root,
          index: comment.source.start,
          result,
          ruleName
        });
      }
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
