import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-import-no-import");

export const messages = utils.ruleMessages(ruleName, {
  expected: "@import is disallowed, replace it with @use"
});

export default function(on) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: on
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("import", node =>
      utils.report({
        message: messages.rejected,
        node,
        result,
        ruleName
      })
    );
  };
}
