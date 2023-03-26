import { utils } from "stylelint";
import { namespace, ruleUrl, whitespaceChecker } from "../../utils";

export const ruleName = namespace("at-else-if-parentheses-space-before");

export const messages = utils.ruleMessages(ruleName, {
  rejectedBefore: () =>
    "Unexpected whitespace before parentheses in else-if declaration",
  expectedBefore: () =>
    "Expected a single space before parentheses in else-if declaration"
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

    const match = /^if\s*\(/;
    const replacement = value === "always" ? "if (" : "if(";

    const checker = whitespaceChecker("space", value, messages).before;

    root.walkAtRules("else", decl => {
      // return early if the else-if statement is not surrounded by parentheses
      if (!match.test(decl.params)) {
        return;
      }

      if (context.fix) {
        decl.params = decl.params.replace(match, replacement);
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
