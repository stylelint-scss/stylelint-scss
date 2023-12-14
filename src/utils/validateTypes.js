/**
 * Checks if the value is a boolean or a Boolean object.
 * @param {unknown} value
 * @returns {value is boolean}
 */
export function isBoolean(value) {
  return typeof value === "boolean" || value instanceof Boolean;
}

/**
 * Checks if the value is a regular expression.
 * @param {unknown} value
 * @returns {value is RegExp}
 */
export function isRegExp(value) {
  return value instanceof RegExp;
}

/**
 * Checks if the value is a string or a String object.
 * @param {unknown} value
 * @returns {value is string}
 */
export function isString(value) {
  return typeof value === "string" || value instanceof String;
}
