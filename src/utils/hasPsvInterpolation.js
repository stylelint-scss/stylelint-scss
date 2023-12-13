/**
 * Check whether a string has postcss-simple-vars interpolation
 *
 * @param {string} string
 */
export default function hasPsvInterpolation(string) {
  return /\$\([\s\S]*?\)/.test(string);
}
