/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 */
export default function hasScssInterpolation(string) {
  return /#{[\s\S]*?}/.test(string);
}
