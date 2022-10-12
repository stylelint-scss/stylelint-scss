import hasLessInterpolation from "./hasLessInterpolation";
import hasPsvInterpolation from "./hasPsvInterpolation";
import hasScssInterpolation from "./hasScssInterpolation";
import hasTplInterpolation from "./hasTplInterpolation";

/**
 * Check whether a string has interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has interpolation
 */
export default function (string) {
  // SCSS or Less interpolation
  return !!(
    hasLessInterpolation(string) ||
    hasScssInterpolation(string) ||
    hasTplInterpolation(string) ||
    hasPsvInterpolation(string)
  );
}
