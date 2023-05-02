"use strict";

const beforeBlockString = require("./beforeBlockString.js");
const hasBlock = require("./hasBlock.js");
const rawNodeString = require("./rawNodeString.js");

/**
 * Return a CSS statement's block -- the string that starts with `{` and ends with `}`.
 *
 * If the statement has no block (e.g. `@import url(foo.css);`),
 * return undefined.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {string|undefined}
 */
module.exports = function (statement) {
  if (!hasBlock(statement)) {
    return;
  }

  return rawNodeString(statement).slice(beforeBlockString(statement).length);
};
