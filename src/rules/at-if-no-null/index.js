import { namespace } from "../../utils";
import { utils } from "stylelint";

export const ruleName = namespace("at-if-no-null");

export const messages = utils.ruleMessages(ruleName, {
  equals_null: "Expected @if not statement rather than @if statement == null",
  not_equals_null: "Expected @if statement rather than @if statement != null"
});

export default function(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atrule => {
      // Do nothing if it's not an @if
      if (atrule.name !== "if") {
        return;
      }

      // If rule != null and (expr), skip
      if (atrule.params.match(/.* != null and .*/)) {
        return;
      }

      if (atrule.params.match(/.* == null[ \t]*\)?/)) {
        utils.report({
          message: messages.equals_null,
          node: atrule,
          result,
          ruleName
        });
      } else if (atrule.params.match(/.* != null[ \t]*\)?/)) {
        utils.report({
          message: messages.not_equals_null,
          node: atrule,
          result,
          ruleName
        });
      }
    });
  };
}
