import get from "lodash.get";
import hasBlock from "./hasBlock";

/**
 * Check whether a Node is a custom property set
 *
 * @param {import('postcss').Rule} node
 * @returns {boolean}
 */
export default function(node) {
  const selector = get(node, "raws.selector.raw", node.selector);

  return (
    node.type === "rule" &&
    hasBlock(node) &&
    selector.startsWith("--") &&
    selector.endsWith(":")
  );
}
