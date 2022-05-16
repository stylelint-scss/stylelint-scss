import { rules, utils } from "stylelint";
import { isInlineComment, namespace } from "../../utils";

const coreRuleName = "comment-no-empty";

export const ruleName = namespace(coreRuleName);

export const messages = utils.ruleMessages(ruleName, {
  rejected: rules[coreRuleName].messages.rejected.replace(
    ` (${coreRuleName})`,
    ""
  )
});

function rule(primary) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    let doubleSlashCommentBlockState = null;

    root.walkComments(comment => {
      const isEmpty = isEmptyComment(comment);

      // postcss considers multiple double-slash comments in a row to be separate comments,
      // but for this rule's purposes we want to track them as one combined comment block.
      if (isStandaloneDoubleSlashComment(comment)) {
        doubleSlashCommentBlockState = {
          firstCommentInBlock: doubleSlashCommentBlockState
            ? doubleSlashCommentBlockState.firstCommentInBlock
            : comment,
          isBlockEmptySoFar:
            isEmpty &&
            (!doubleSlashCommentBlockState ||
              doubleSlashCommentBlockState.isBlockEmptySoFar)
        };

        if (!isStandaloneDoubleSlashComment(comment.next())) {
          if (doubleSlashCommentBlockState.isBlockEmptySoFar) {
            utils.report({
              message: messages.rejected,
              node: doubleSlashCommentBlockState.firstCommentInBlock,
              result,
              ruleName
            });
          }
          doubleSlashCommentBlockState = null;
          return;
        }
      } else {
        doubleSlashCommentBlockState = null;
        if (isEmptyComment(comment)) {
          utils.report({
            message: messages.rejected,
            node: comment,
            result,
            ruleName
          });
        }
      }
    });
  };
}

function isStandaloneDoubleSlashComment(node) {
  return (
    // Must be a comment
    node &&
    node.type === "comment" &&
    // Must be a double-slash comment
    (node.raws.inline || node.inline) &&
    // Must be standalone
    !isInlineComment(node)
  );
}

function isEmptyComment(comment) {
  return comment.text === "";
}

export default rule;
