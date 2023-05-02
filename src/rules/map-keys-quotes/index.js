"use strict";

const valueParser = require("postcss-value-parser");
const { utils } = require("stylelint");
const namespace = require("../../utils/namespace.js");
const ruleUrl = require("../../utils/ruleUrl.js");

const ruleName = namespace("map-keys-quotes");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected keys in map to be quoted."
});

const meta = {
  url: ruleUrl(ruleName)
};

const mathOperators = new Set(["+", "/", "-", "*", "%"]);

function rule(primary) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: ["always"]
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      if (decl.prop[0] !== "$") {
        return;
      }

      valueParser(decl.value).walk(node => {
        if (
          node.type === "function" &&
          node.value === "" &&
          isMap(node.nodes)
        ) {
          // Identify all of the map-keys and see if they're strings (not words).
          const mapKeys = returnMapKeys(node.nodes);

          for (const mapKey of mapKeys) {
            if (mathOperators.has(mapKey.value)) {
              continue;
            }

            if (mapKey.type === "word" && isNaN(mapKey.value)) {
              utils.report({
                message: messages.expected,
                node: decl,
                result,
                ruleName
              });
            }
          }
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

// Takes in a list of map nodes and identifies if they are a map.
// A map is identified by the pattern: [string/word colon(div) anything comma(div) ...]
function isMap(nodes) {
  if (nodes.length < 4) {
    return false;
  }

  if (nodes[0].type !== "word" && nodes[0].type !== "string") {
    return false;
  }

  if (nodes[1].value !== ":") {
    return false;
  }

  if (nodes[3].value !== ",") {
    return false;
  }

  return true;
}

function returnMapKeys(array) {
  const newArray = [];

  for (let i = 0; i < array.length; i += 4) {
    newArray.push(array[i]);
  }

  return newArray;
}

module.exports = rule;
