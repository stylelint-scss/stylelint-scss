/**
 * Determine whether the given node is of the given type.
 *
 * @param  {import('postcss').Node} node
 * @param  {string} type
 * @return {boolean}
 */
export default function isType(node, type) {
  return node && node.type === type;
}
