/**
 * Check if a character is whitespace.
 *
 * @param {string} char - A single character
 * @return {boolean}
 */
export default function isWhitespace(char) {
  return [" ", "\n", "\t", "\r", "\f"].includes(char);
}
