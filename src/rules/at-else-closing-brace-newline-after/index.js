import { utils } from "stylelint";
import { isBoolean, namespace, ruleUrl } from "../../utils";
import { sassConditionalBraceNLAfterChecker } from "../at-if-closing-brace-newline-after";

export const ruleName = namespace("at-else-closing-brace-newline-after");

export const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected newline after "}" of @else statement',
  rejected: 'Unexpected newline after "}" of @else statement'
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(expectation, options, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["always-last-in-chain"]
      },
      {
        actual: options,
        possible: {
          disableFix: isBoolean
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    sassConditionalBraceNLAfterChecker({
      root,
      result,
      ruleName,
      atRuleName: "else",
      expectation,
      messages,
      context,
      options
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
