import stylelint from "stylelint";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import { sassConditionalBraceSpaceAfterChecker } from "../at-if-closing-brace-space-after/index.js";

const { utils } = stylelint;

const ruleName = namespace("at-else-closing-brace-space-after");

const messages = utils.ruleMessages(ruleName, {
  expected: 'Expected single space after "}" of @else statement',
  rejected: 'Unexpected space after "}" of @else statement'
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
};

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always-intermediate", "never-intermediate"]
    });

    if (!validOptions) {
      return;
    }

    sassConditionalBraceSpaceAfterChecker({
      root,
      result,
      ruleName,
      atRuleName: "else",
      expectation,
      messages
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
