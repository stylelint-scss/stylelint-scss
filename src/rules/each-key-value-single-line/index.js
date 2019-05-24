import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("partial-no-import");

export const messages = utils.ruleMessages(ruleName, {
  expected:
    "Use @each $key, $value in $map syntax instead of $value: map-get($map, $key)"
});

export default function(on) {
  return (root, result) => {
    root.walkAtRules("each", rule => {});
  };
}
