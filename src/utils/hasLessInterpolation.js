/**
 * Check whether a string has less interpolation
 *
 * @param {string} string
 * @return {boolean} If `true`, a string has less interpolation
 */
export default function hasLessInterpolation(string) {
  return /@{[\s\S]*?}/.test(string);
}
