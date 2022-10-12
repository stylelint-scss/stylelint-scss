/**
 * Check whether a string has scss interpolation
 *
 * @param {string} string
 */
export default function (string) {
  return /#{.+?}/.test(string);
}
