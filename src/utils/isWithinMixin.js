import { isAtRule } from "./typeGuards.js";

/**
 * Check whether a node is nested inside a `@mixin`
 *
 * @param {import('postcss').Node} node
 * @returns {boolean}
 */
export function isWithinMixin(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (isAtRule(parent) && parent.name === "mixin") {
      return true;
    }
  }

  return false;
}
