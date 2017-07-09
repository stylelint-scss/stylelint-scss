import { namespace } from "../../utils";
import { utils } from "stylelint";

export const ruleName = namespace("at-else-closing-brace-newline-after");

export const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected newline after "}" of @else statement',
  rejected: 'Unexpected newline after "}" of @else statement'
});

import { sassConditionalBraceNLAfterChecker } from "../at-if-closing-brace-newline-after";

export default function(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always-last-in-chain"]
    });
    if (!validOptions) {
      return;
    }

    sassConditionalBraceNLAfterChecker({
      root,
      result,
      ruleName,
      atRuleName: "else",
      expectation,
      messages
    });
  };
}
