import { utils } from "stylelint";
import { namespace, isNativeCssFunction } from "../../utils";
import valueParser from "postcss-value-parser";

export const ruleName = namespace("function-quote-no-quoted-strings-inside");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Expected `$value * 1px` instead of `#{value}px"
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
