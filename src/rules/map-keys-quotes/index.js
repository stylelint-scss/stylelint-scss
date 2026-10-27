import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

const { utils } = stylelint;

const ruleName = namespace("map-keys-quotes");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected keys in map to be quoted."
});

const meta = {
  url: ruleUrl(ruleName)
};

/** @type {import('stylelint').Rule<"always">} */
const rule = primary => {
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
        if (node.type !== "function" || node.value !== "") {
          return;
        }

        for (const mapKey of getMapKeys(node.nodes)) {
          if (mapKey.type === "word" && isNaN(Number(mapKey.value))) {
            utils.report({
              message: messages.expected,
              node: decl,
              result,
              ruleName,
              word: mapKey.value
            });
          }
        }
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

/** @typedef {import('postcss-value-parser').Node} Node */

/**
 * @param {Node} node
 * @param {string} value
 * @returns {boolean}
 */
function isDiv(node, value) {
  return node.type === "div" && node.value === value;
}

/**
 * @param {Array<Node>} nodes
 * @returns {Array<Array<Node>>}
 */
function splitEntries(nodes) {
  /** @type {Array<Array<Node>>} */
  const entries = [[]];

  for (const node of nodes) {
    if (isDiv(node, ",")) {
      entries.push([]);
    } else {
      entries[entries.length - 1].push(node);
    }
  }

  return entries;
}

/**
 * @param {Array<Node>} entry
 * @returns {Node | undefined} The key's first node, when the entry is `key: value`
 */
function getEntryKey(entry) {
  const [key] = entry;
  const isKey = key?.type === "word" || key?.type === "string";

  return isKey && entry.some(node => isDiv(node, ":")) ? key : undefined;
}

/**
 * @param {Array<Node>} nodes
 * @returns {Array<Node>} Empty when the nodes are not a map
 */
function getMapKeys(nodes) {
  const keys = splitEntries(nodes).map(getEntryKey);

  if (keys.length < 2 || !keys[0]) {
    return [];
  }

  return keys.filter(key => key !== undefined);
}

export default rule;
