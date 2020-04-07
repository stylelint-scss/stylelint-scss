import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("comment-no-empty");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Empty comments are forbidden"
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
      if (isEmptyComment(comment)) {
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

function isEmptyComment(comment) {
    return comment.text === "";
}

export default rule;