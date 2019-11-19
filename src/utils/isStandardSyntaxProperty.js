"use strict";

const isStandardSyntaxProperty = require("stylelint/lib/utils/isStandardSyntaxProperty");

/**
 * Check whether a property is standard
 *
 * @param {string} property
 * @return {boolean} If `true`, the property is standard
 */
module.exports = function(property) {
  return isStandardSyntaxProperty(property);
};
