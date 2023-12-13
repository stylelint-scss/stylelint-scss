import hasInterpolation from "./hasInterpolation.js";
import isStandardSyntaxSelector from "./isStandardSyntaxSelector.js";

/**
 * Check whether a selector is standard
 *
 * @param {string} selector
 * @return {boolean} If `true`, the selector is standard
 */
export default function isStandardSelector(selector) {
  const standardSyntaxSelector = isStandardSyntaxSelector(selector);

  // SCSS placeholder selectors
  if (!standardSyntaxSelector) {
    if (selector.indexOf("%") === 0 && !hasInterpolation(selector)) {
      return true;
    }
  }

  return standardSyntaxSelector;
}
