"use strict";

const hasLessInterpolation = require("./hasLessInterpolation.js");
const hasPsvInterpolation = require("./hasPsvInterpolation.js");
const hasScssInterpolation = require("./hasScssInterpolation.js");
const hasTplInterpolation = require("./hasTplInterpolation.js");

/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has interpolation
 */
module.exports = function (string) {
  // SCSS or Less interpolation
  return Boolean(
    hasLessInterpolation(string) ||
      hasScssInterpolation(string) ||
      hasTplInterpolation(string) ||
      hasPsvInterpolation(string)
  );
};
