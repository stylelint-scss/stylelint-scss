import stylelint from "stylelint";
import atRuleParamIndex from "../../utils/atRuleParamIndex.js";
import whitespaceChecker from "../../utils/whitespaceChecker.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("at-mixin-parentheses-space-before");

const messages = utils.ruleMessages(ruleName, {
  rejectedBefore: () =>
    "Unexpected whitespace before parentheses in mixin declaration",
  expectedBefore: () =>
    "Expected a single space before parentheses in mixin declaration"
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(value, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    const match = /^([\w-]+)\s*\(/;
    const replacement = value === "always" ? "$1 (" : "$1(";

    const checker = whitespaceChecker("space", value, messages).before;

    root.walkAtRules("mixin", atRule => {
      if (context.fix) {
        atRule.params = atRule.params.replace(match, replacement);

        return;
      }

      const parenIndex = atRule.params.indexOf("(");
      const baseIndex = atRuleParamIndex(atRule);

      checker({
        source: atRule.params,
        index: parenIndex,
        err: message =>
          utils.report({
            message,
            node: atRule,
            result,
            ruleName,
            index: baseIndex + parenIndex
          })
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
