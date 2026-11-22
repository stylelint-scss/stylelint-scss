/**
 * Check whether a property name is a custom property, e.g. `--foo`
 *
 * @param {string} name
 * @returns {boolean}
 */
export function isCustomPropertyName(name) {
  return name.startsWith("--");
}
