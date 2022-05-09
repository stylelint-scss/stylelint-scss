import { rules, utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";

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

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

function isEmptyComment(comment) {
  return comment.text === "";
}
