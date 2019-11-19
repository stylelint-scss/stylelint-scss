"use strict";

const postCssSelectorParser = require("postcss-selector-parser");

module.exports = function(selector, result, node, cb) {
  try {
    postCssSelectorParser(cb).process(selector);
  } catch (e) {
    result.warn("Cannot parse selector", { node });
  }
};
