import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-use-no-unnamespaced");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected @use without namespace"
});

export default function(actual) {
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
