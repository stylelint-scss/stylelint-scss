import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("at-mixin-named-arguments");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected dollar-variable as a media feature value",
  expected:
    "Expected a dollar-variable (e.g. $var) to be used as a media feature value"
});

export default function() {
  return function(root) {
    root.walk(console.log);
  };
}
