"use strict";

const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-each-key-value-single-line");

const messages = utils.ruleMessages(ruleName, {
  expected:
    "Use @each $key, $value in $map syntax instead of $value: map-get($map, $key)"
});

function rule(primary) {
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
      if (parts[0].length === 2) {
        return;
      }

      // If didn't call map-keys, return.
      if (!didCallMapKeys(parts[1])) {
        return;
      }

      // Loop over decls inside of each statement and loop for variable assignments.
      rule.walkDecls(innerDecl => {
        // Check that this decl is a map-get call
        if (innerDecl.prop[0] !== "$") {
          return;
        }

        if (!didCallMapGet(innerDecl.value)) {
          return;
        }

        // Check map_name + key_name match.
        const map_get_parts = mapGetParameters(innerDecl.value);

        // Check map names match.
        if (map_get_parts[0] !== mapName(parts[1])) {
          return;
        }

        // Match key names match.
        if (map_get_parts[1] !== parts[0][0]) {
          return;
        }

        utils.report({
          message: messages.expected,
          node: rule,
          result,
          ruleName
        });
      });
    });
  };
}

// Takes in a param string from node.params
// Returns: [[key variable, value variable], map_decl] (all Strings)
function separateEachParams(paramString) {
  const parts = paramString.split("in");

  return [parts[0].split(",").map(s => s.trim()), parts[1].trim()];
}

function didCallMapKeys(map_decl) {
  return map_decl.match(/map-keys\(.*\)/);
}

function didCallMapGet(map_decl) {
  return map_decl.match(/map-get\((.*),(.*)\)/);
}

// Fetch the name of the map from a map-keys() call.
function mapName(map_decl) {
  if (didCallMapKeys(map_decl)) {
    return map_decl.match(/map-keys\((.*)\)/)[1];
  } else {
    return map_decl;
  }
}

// Returns the parameters of a map-get call
// Returns [map variable, key_variable]
function mapGetParameters(mapGetDecl) {
  const parts = mapGetDecl.match(/map-get\((.*), ?(.*)\)/);

  return [parts[1], parts[2]];
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
