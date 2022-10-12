import { namespace, ruleUrl, whitespaceChecker } from "../../utils";
import { utils } from "stylelint";
import { variableColonSpaceChecker } from "../dollar-variable-colon-space-after";

export const ruleName = namespace("dollar-variable-colon-space-before");

export const messages = utils.ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ":"',
  rejectedBefore: () => 'Unexpected whitespace before ":"',
});

export const meta = {
  url: ruleUrl(ruleName),
};

export default function rule(expectation, _, context) {
  const checker = whitespaceChecker("space", expectation, messages);

  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"],
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
      context,
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
