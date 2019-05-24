import { utils } from "stylelint";
import { namespace } from "../../utils";

export const ruleName = namespace("each-key-value-single-line");

export const messages = utils.ruleMessages(ruleName, {
  expected:
    "Use @each $key, $value in $map syntax instead of $value: map-get($map, $key)"
});

export default function(primary) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("each", rule => {
      const parts = separateEachParams(rule.params);

      // If loop is fetching both key + value, return
      if (parts[0].length == 2) {
        return;
      }

      // If didn't call map-keys, return.
      if (!didCallMapKeys(parts[1])) {
        return;
      }

      utils.report({
        message: messages.rejected,
        node: rule,
        result,
        ruleName
      });
    });
  };
}

// Takes in a param string from node.params
// Returns: [[key variable, value variable], map_decl] (all Strings)
function separateEachParams(paramString) {
  const parts = paramString.split("in");
  return [parts[0].split(","), parts[1]];
}

function didCallMapKeys(map_decl) {
  return map_decl.match(/map-keys\(.*\)/);
}

function mapName(map_decl) {
  if (didCallMapKeys(map_decl)) {
    return map_decl.match(/map-keys\(.*\)/)[1];
  } else {
    return map_decl;
  }
}
