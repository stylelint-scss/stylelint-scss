import isStandardSyntaxProperty from "stylelint/lib/utils/isStandardSyntaxProperty";

/**
 * Check whether a property is standard
 *
 * @param {string} property
 * @return {boolean} If `true`, the property is standard
 */
export default function(property) {
  return isStandardSyntaxProperty(property);
}
