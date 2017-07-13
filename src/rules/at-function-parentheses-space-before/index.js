import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-function-parentheses-space-before");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected whitespace before parentheses in function declaration",
  expected: "Expected a single space before parentheses in function declaration"
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

    root.walkAtRules(decl => {
      if (decl.name !== "function") {
        return;
      }

      if (value === "never" && /^[^ ]+\(/.exec(decl.params)) {
        return;
      }

      if (value === "always" && /^[^ ]+ \(/.exec(decl.params)) {
        return;
      }

      utils.report({
        message: messages[value === "never" ? "rejected" : "expected"],
        node: decl,
        result,
        ruleName
      });
    });
  };
}
