import stylelint from "stylelint";
import { isRegExp, isString } from "../../utils/validateTypes.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("at-mixin-pattern");

const messages = utils.ruleMessages(ruleName, {
  expected: (mixinName, pattern) =>
    `Expected "${mixinName}" to match pattern "${pattern}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(pattern) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: pattern,
      possible: [isRegExp, isString]
    });

    if (!validOptions) {
      return;
    }

    const regexpPattern = isString(pattern) ? new RegExp(pattern) : pattern;

    root.walkAtRules("mixin", atRule => {
      // Stripping the mixin of its arguments
      const mixinName = atRule.params.replace(/(\s*)\([\s\S]*\)/g, "");

      if (regexpPattern.test(mixinName)) {
        return;
      }

      utils.report({
        message: messages.expected,
        messageArgs: [mixinName, pattern],
        node: atRule,
        result,
        ruleName,
        word: mixinName
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
