import hasLessInterpolation from "./hasLessInterpolation.js";
import hasPsvInterpolation from "./hasPsvInterpolation.js";
import hasScssInterpolation from "./hasScssInterpolation.js";
import hasTplInterpolation from "./hasTplInterpolation.js";

/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has interpolation
 */
export default function hasInterpolation(string) {
  // SCSS or Less interpolation
  return !!(
    hasLessInterpolation(string) ||
    hasScssInterpolation(string) ||
    hasTplInterpolation(string) ||
    hasPsvInterpolation(string)
  );
}
