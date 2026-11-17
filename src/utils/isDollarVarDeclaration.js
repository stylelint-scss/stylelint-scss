import { isDeclaration } from "./typeGuards.js";

/**
 * Check whether a node declares a dollar variable, e.g. `$foo: red`
 *
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export function isDollarVarDeclaration(node) {
  return isDeclaration(node) && node.prop.startsWith("$");
}
