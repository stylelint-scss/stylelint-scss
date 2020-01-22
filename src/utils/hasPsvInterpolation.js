/**
 * Check whether a string has postcss-simple-vars interpolation
 *
 * @param {string} string
 */
export default function(string) {
  return /\$\(.+?\)/.test(string);
}
