/**
 * Match every function call in a string, flattened into full matches and names
 *
 * @param {string} inputString
 * @returns {Array<string>}
 */
export function extractFunctionName(inputString) {
  return [...inputString.matchAll(/(?:\s*([\w\-$]+)\s*)?\(/g)].flat();
}
