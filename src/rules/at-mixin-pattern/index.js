import { utils } from "stylelint";
import { isRegExp, isString, namespace, ruleUrl } from "../../utils";

export const ruleName = namespace("at-mixin-pattern");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected @mixin name to match specified pattern"
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(pattern) {
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
      const mixinName = decl.params.replace(/(\s*)\([\s\S]*\)/g, "");

      if (regexpPattern.test(mixinName)) {
        return;
      }

      const mixinTopLine = Object.assign({}, decl.source.start);
      mixinTopLine.line += 1;
      mixinTopLine.column = 0;

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
        end: mixinTopLine
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
