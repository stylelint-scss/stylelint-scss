import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("comment-no-empty");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected empty comment"
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
          message: messages.rejected,
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
