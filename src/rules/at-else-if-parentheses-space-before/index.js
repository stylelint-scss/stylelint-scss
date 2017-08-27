import { utils } from "stylelint";
import { namespace, whitespaceChecker } from "../../utils";

export const ruleName = namespace("at-else-if-parentheses-space-before");

export const messages = utils.ruleMessages(ruleName, {
  rejectedBefore: () =>
    "Unexpected whitespace before parentheses in else-if declaration",
  expectedBefore: () =>
    "Expected a single space before parentheses in else-if declaration"
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
    root.walkAtRules("else", decl => {
      // return early if the else-if statement is not surrounded by parentheses
      if (!/^if\s*?\(/.test(decl.params)) {
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
