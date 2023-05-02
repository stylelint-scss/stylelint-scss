"use strict";

const hasInterpolation = require("./hasInterpolation.js");
const isStandardSyntaxSelector = require("./isStandardSyntaxSelector.js");

/**
 * Check whether a selector is standard
 *
 * @param {string} selector
 * @return {boolean} If `true`, the selector is standard
 */
module.exports = function (selector) {
  const standardSyntaxSelector = isStandardSyntaxSelector(selector);

  // SCSS placeholder selectors
  if (
    !standardSyntaxSelector &&
    selector.indexOf("%") === 0 &&
    !hasInterpolation(selector)
  ) {
    return true;
  }

  return standardSyntaxSelector;
};
