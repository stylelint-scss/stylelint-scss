import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("comment-no-loud");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Use // for comments instead of /*"
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
          message: messages.rejected,
          node: comment,
          result,
          ruleName
        });
      }
    });
  };
}

function isLoudComment(comment) {
  return comment.source.input.css.includes("/*");
}

export default rule;
