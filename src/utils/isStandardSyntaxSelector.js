import hasInterpolation from "./hasInterpolation.js";

/**
 * Check whether a selector is standard
 *
 * @param {string} selector
 * @returns {boolean}
 */
export default function isStandardSyntaxSelector(selector) {
  // SCSS or Less interpolation
  if (hasInterpolation(selector)) {
    return false;
  }

  // SCSS placeholder selectors
  if (selector.startsWith("%")) {
    return false;
  }

  // Less :extend()
  if (/:extend(\(.*?\))?/.test(selector)) {
    return false;
  }

  // Less mixin with resolved nested selectors (e.g. .foo().bar or .foo(@a, @b)[bar])
  if (/\.[\w-]+\(.*\).+/.test(selector)) {
    return false;
  }

  // ERB template tags
  if (selector.includes("<%") || selector.includes("%>")) {
    return false;
  }

  return true;
}
