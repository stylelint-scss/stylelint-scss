/**
 * Determine whether the given node is of the given type.
 *
 * @param  {{ type: string } | null | undefined} node
 * @param  {string} type
 * @return {boolean}
 */
export default function isType(node, type) {
  return node && node.type === type;
}
