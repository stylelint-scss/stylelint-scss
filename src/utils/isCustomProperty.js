import { isDeclaration } from "./typeGuards.js";

/**
 * Check whether a node is a custom property declaration, e.g. `--foo: red`
 *
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export function isCustomProperty(node) {
  return isDeclaration(node) && node.prop.startsWith("--");
}
