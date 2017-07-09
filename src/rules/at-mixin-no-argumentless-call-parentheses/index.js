import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-mixin-no-argumentless-call-parentheses");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Unexpected parentheses in argumentless @mixin call"
});

export default function(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });
    if (!validOptions) {
      return;
    }

    root.walkAtRules("include", decl => {
      if (decl.params.search(/\(\s*?\)\s*?$/) === -1) {
        return;
      }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName
      });
    });
  };
}
