// Remove empty lines before a node. Mutates the node.
export function removeEmptyLinesBefore(
  node /*: postcss$node*/,
  newline /*: '\n' | '\r\n'*/
) /*: postcss$node*/ {
  node.raws.before = node.raws.before.replace(/(\r?\n\s*\n)+/g, newline);

  return node;
}
