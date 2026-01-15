import stylelint from "stylelint";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("no-dollar-variables");

const messages = utils.ruleMessages(ruleName, {
  rejected: variable => `Unexpected dollar variable ${variable}`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      if (decl.prop[0] !== "$") {
        return;
      }

      utils.report({
        message: messages.rejected(decl.prop),
        node: decl,
        result,
        ruleName,
        word: decl.prop
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
