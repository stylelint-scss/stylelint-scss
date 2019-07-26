import { isRegExp, isString } from "lodash";
import { rules, utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-conditional-rule-no-parentheses");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Do not use () to surround statements for @-rules"
});

export default function(primaryOption, secondaryOptions) {
  return (root, result) => {};
}
