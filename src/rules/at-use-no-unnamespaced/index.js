import { utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";

export const ruleName = namespace("at-use-no-unnamespaced");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected @use without namespace"
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("use", decl => {
      if (/as\s*\*\s*(?:$|with\s*\()/.test(decl.params)) {
        utils.report({
          message: messages.rejected,
          node: decl,
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
