import { atRuleRegexes } from "./regexes.js";
import { isAtRule } from "./typeGuards.js";
import { nestingSupportedAtKeywords } from "./atKeywords.js";

/** @import { Container, Declaration, Document } from "postcss" */

/**
 * Check whether a declaration is a descriptor one
 *
 * @param {Declaration} decl
 * @returns {boolean}
 */
export default function isDescriptorDeclaration(decl) {
  /** @type {Container | Document | undefined} */
  let node = decl.parent;

  while (node) {
    if (isAtRule(node)) {
      if (atRuleRegexes.propertyName.test(node.name)) {
        return false;
      }

      if (!nestingSupportedAtKeywords.has(node.name.toLowerCase())) {
        return true;
      }
    }

    node = node.parent;
  }

  return false;
}
