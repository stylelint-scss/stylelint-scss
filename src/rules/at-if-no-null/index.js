import { isSingleLineString, namespace } from "../../utils";
import { utils } from "stylelint";
import { isBoolean } from "lodash";

export const ruleName = namespace("at-if-no-null");

export const messages = utils.ruleMessages(ruleName, {
  equals_null: "Expected @if(statement) rather than @if(statement == null)",
  not_equals_null: "Expected @if(!statement) rather than @if(statement != null)"
});

export default function(expectation, _, context) {
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

      if (atrule.params.match(/\(.* == null\)/)) {
        utils.report({
          message: messages.equals_null,
          node: atrule,
          result,
          ruleName
        });
      } else if (atrule.params.match(/\(.* != null \)/)) {
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
