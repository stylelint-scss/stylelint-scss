"use strict";

const postCssSelectorParser = require("postcss-selector-parser");

module.exports = function (selector, result, node, cb) {
  try {
    return postCssSelectorParser(cb).processSync(selector);
  } catch {
    result.warn("Cannot parse selector", { node });
  }
};
