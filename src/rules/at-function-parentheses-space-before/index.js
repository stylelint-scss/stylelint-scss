import { utils } from "stylelint";
import { namespace, whitespaceChecker } from "../../utils";

export const ruleName = namespace("at-function-parentheses-space-before");

export const messages = utils.ruleMessages(ruleName, {
  rejectedBefore: () =>
    "Unexpected whitespace before parentheses in function declaration",
  expectedBefore: () =>
    "Expected a single space before parentheses in function declaration"
});

export default function(value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value,
      possible: ["always", "never"]
    });
    if (!validOptions) {
      return;
    }

    const checker = whitespaceChecker("space", value, messages).before;
    root.walkAtRules("function", decl => {
      checker({
        source: decl.params,
        index: decl.params.indexOf("("),
        err: message => utils.report({ message, node: decl, result, ruleName })
      });
    });
  };
}
