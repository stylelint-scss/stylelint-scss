import { utils } from "stylelint";
import { namespace, isNativeCssFunction } from "../../utils";
import valueParser from "postcss-value-parser";

export const ruleName = namespace("function-forward-before-use");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Forward function should be used before use function"
});

function rule(primary, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }
  };
}

export default rule;
