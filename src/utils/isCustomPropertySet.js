import { isDeclaration } from "./typeGuards.js";

/**
 * Check whether a Node is a custom property set
 *
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export default function isCustomPropertySet(node) {
  if (!isDeclaration(node)) {
    return false;
  }

  const prop =
    /** @type {{ raw?: string } | undefined} */ (node.raws.prop)?.raw ||
    node.prop;
  const value = node.raws.value?.raw || node.value;

  return prop.startsWith("--") && value.startsWith("{") && value.endsWith("}");
}
