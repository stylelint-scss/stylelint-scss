import { isRegExp, isString } from "lodash";
import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-mixin-pattern");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected @mixin name to match specified pattern"
});

export default function(pattern) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: pattern,
      possible: [isRegExp, isString]
    });

    if (!validOptions) {
      return;
    }

    const regexpPattern = isString(pattern) ? new RegExp(pattern) : pattern;

    root.walkAtRules(decl => {
      if (decl.name !== "mixin") {
        return;
      }

      // Stripping the mixin of its arguments
      const mixinName = decl.params.replace(/(\s*?)\((?:\s|\S)*\)/g, "");

      if (regexpPattern.test(mixinName)) {
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
