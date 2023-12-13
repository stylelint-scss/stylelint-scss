import stylelint from "stylelint";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const coreRuleName = "comment-no-empty";

const ruleName = namespace(coreRuleName);

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected empty comment"
});

const meta = {
  url: ruleUrl(ruleName)
};

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

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

function isEmptyComment(comment) {
  return comment.text === "";
}

export default rule;
