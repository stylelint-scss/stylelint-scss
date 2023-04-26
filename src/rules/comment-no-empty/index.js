import { rules, utils } from "stylelint";
import { isInlineComment, namespace, ruleUrl } from "../../utils";

const coreRuleName = "comment-no-empty";

export const ruleName = namespace(coreRuleName);

export const messages = utils.ruleMessages(ruleName, {
  rejected: rules[coreRuleName].messages.rejected.replace(
    ` (${coreRuleName})`,
    ""
  )
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(primary) {
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
        if (doubleSlashCommentBlockState) {
          doubleSlashCommentBlockState.isBlockEmptySoFar &= isEmpty;
        } else {
          doubleSlashCommentBlockState = {
            firstCommentInBlock: comment,
            isBlockEmptySoFar: isEmpty
          };
        }

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
        }
      } else {
        if (isEmptyComment(comment)) {
          utils.report({
            message: messages.rejected,
            node: comment,
            result,
            ruleName
          });
        }
        doubleSlashCommentBlockState = null;
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

function isStandaloneDoubleSlashComment(node) {
  return (
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
