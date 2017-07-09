import { findCommentsInRaws, namespace, optionsHaveIgnored } from "../../utils";
import { utils } from "stylelint";

export const ruleName = namespace("double-slash-comment-inline");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected //-comment to be inline comment",
  rejected: "Unexpected inline //-comment"
});

const stylelintCommandPrefix = "stylelint-";

export default function(expectation, options) {
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

    const comments = findCommentsInRaws(root.source.input.css);
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
  };
}
