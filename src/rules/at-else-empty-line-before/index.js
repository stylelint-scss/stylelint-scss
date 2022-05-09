import { hasEmptyLine, namespace, ruleUrl } from "../../utils";
import { utils } from "stylelint";

export const ruleName = namespace("at-else-empty-line-before");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected empty line before @else"
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(expectation, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["never"]
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atrule => {
      if (atrule.name !== "else") {
        return;
      }

      // Don't need to ignore "the first rule in a stylesheet", etc, cases
      // because @else should always go after @if

      if (!hasEmptyLine(atrule.raws.before)) {
        return;
      }

      if (context.fix) {
        atrule.raws.before = " ";

        return;
      }

      utils.report({
        message: messages.rejected,
        node: atrule,
        result,
        ruleName
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
