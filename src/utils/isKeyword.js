/**
 * Determine if the given node is a keyword.
 *
 * @param  {import('postcss').Node} node
 * @param  {array} keywords
 * @return {boolean}
 */
export default function(node, keywords) {
  if (!node || node.type !== "tag") {
    return false;
  }

  return keywords.includes(node.value);
}
