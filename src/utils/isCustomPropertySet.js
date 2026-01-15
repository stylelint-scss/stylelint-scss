/**
 * Check whether a Node is a custom property set
 *
 * @param {import('postcss').Rule} node
 * @returns {boolean}
 */
export default function isCustomPropertySet(node) {
  const prop = node?.raws?.prop?.raw || node.prop;
  const value = node?.raws?.value?.raw || node.value;

  return (
    node.type === "decl" &&
    prop.startsWith("--") &&
    value.startsWith("{") &&
    value.endsWith("}")
  );
}
