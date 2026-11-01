/**
 * Get the index of a declaration's value
 *
 * @param {import('postcss').Declaration} decl
 * @return {number} The index
 */
export default function declarationValueIndex(decl) {
  const beforeColon = decl.toString().indexOf(":");
  const afterColon =
    decl.raw("between").length - decl.raw("between").indexOf(":");

  return beforeColon + afterColon;
}
