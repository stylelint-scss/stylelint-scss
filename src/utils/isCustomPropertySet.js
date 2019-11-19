"use strict";

const hasBlock = require("./hasBlock");
const { get } = require("lodash");

/**
 * Check whether a Node is a custom property set
 *
 * @param {import('postcss').Rule} node
 * @returns {boolean}
 */
module.exports = function(node) {
  const selector = get(node, "raws.selector.raw", node.selector);

  return (
    node.type === "rule" &&
    hasBlock(node) &&
    selector.startsWith("--") &&
    selector.endsWith(":")
  );
};
