/**
 * Create configurationError from text and set CLI exit code
 *
 * @param {string} text
 * @return {Error & { code: number }} - The error, with text and exit code
 */
export default function configurationError(text) {
  return Object.assign(new Error(text), { code: 78 });
}
