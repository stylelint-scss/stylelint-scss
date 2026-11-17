import { isCustomProperty } from "./isCustomProperty.js";

/**
 * Check whether a Node is a custom property set
 *
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export default function isCustomPropertySet(node) {
  if (!isCustomProperty(node)) {
    return false;
  }

  const decl = /** @type {import('postcss').Declaration} */ (node);
  const value = decl.raws.value?.raw || decl.value;

  return value.startsWith("{") && value.endsWith("}");
}
