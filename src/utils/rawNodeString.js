/**
 * Stringify PostCSS node including its raw "before" string.
 *
 * @param {import('postcss').AnyNode} node - Any PostCSS node
 * @return {string}
 */
export default function rawNodeString(node) {
  let result = "";

  if (node.raws.before) {
    result += node.raws.before;
  }

  result += node.toString();

  return result;
}
