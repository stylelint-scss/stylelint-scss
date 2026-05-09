import { atRuleRegexes } from "./regexes.js";
import { isAtRule } from "./typeGuards.js";
import { nestingSupportedAtKeywords } from "./atKeywords.js";

/**
 * Check whether a declaration is a descriptor one
 *
 * @param {import('postcss').Declaration} decl
 * @returns {boolean}
 */
export default function isDescriptorDeclaration(decl) {
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
