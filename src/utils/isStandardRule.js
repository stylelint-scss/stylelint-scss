"use strict";

const isStandardSyntaxRule = require("stylelint/lib/utils/isStandardSyntaxRule");

/**
 * Check whether a rule is standard
 *
 * @param {Rule} postcss rule node
 * @return {boolean} If `true`, the rule is standard
 */
module.exports = function(rule) {
  return isStandardSyntaxRule(rule);
};
