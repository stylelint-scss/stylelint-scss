import { utils } from "stylelint";
import { namespace, ruleUrl, whitespaceChecker } from "../../utils";

export const ruleName = namespace("at-function-parentheses-space-before");

export const messages = utils.ruleMessages(ruleName, {
  rejectedBefore: () =>
    "Unexpected whitespace before parentheses in function declaration",
  expectedBefore: () =>
    "Expected a single space before parentheses in function declaration"
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(value, _, context) {
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

    root.walkAtRules("function", decl => {
      if (context.fix) {
        decl.params = decl.params.replace(match, replacement);

        return;
      }

      checker({
        source: decl.params,
        index: decl.params.indexOf("("),
        err: message => utils.report({ message, node: decl, result, ruleName })
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
