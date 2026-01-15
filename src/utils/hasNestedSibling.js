/**
 * Determines whether a given node has nested sibling.
 *
 * @param  {import('postcss').Node} node
 * @return {boolean}
 */
export default function hasNestedSibling(node) {
  return (
    node && node.parent.nodes.some(n => n !== node && n.type === "nesting")
  );
}
