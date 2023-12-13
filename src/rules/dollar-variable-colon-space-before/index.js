import stylelint from "stylelint";
import { variableColonSpaceChecker } from "../dollar-variable-colon-space-after/index.js";
import whitespaceChecker from "../../utils/whitespaceChecker.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("dollar-variable-colon-space-before");

const messages = utils.ruleMessages(ruleName, {
  expectedBefore: () => 'Expected single space before ":"',
  rejectedBefore: () => 'Unexpected whitespace before ":"'
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(expectation, _, context) {
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

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
