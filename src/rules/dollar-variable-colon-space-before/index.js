import { namespace, whitespaceChecker } from "../../utils";
import { utils } from "stylelint";
import { variableColonSpaceChecker } from "../dollar-variable-colon-space-after";

export const ruleName = namespace("dollar-variable-colon-space-before");

export const messages = utils.ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ":"',
  rejectedBefore: () => 'Unexpected whitespace before ":"'
});

export default function(expectation, _, context) {
  const checker = whitespaceChecker("space", expectation, messages);
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });
    if (!validOptions) {
      return;
    }

    variableColonSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
      position: "before",
      expectation,
      context
    });
  };
}
