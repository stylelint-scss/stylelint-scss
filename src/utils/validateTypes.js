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

/**
 * Checks if the value is a function
 * @param {unknown} value
 * @returns {value is Function}
 */
export function isFunctionCall(value) {
  const functionCallPattern = /[a-zA-Z0-9_-]+\s*\(\s*(.*)\s*\)/g;
  return functionCallPattern.test(value);
}

/**
 * Checks if the value is a if statement.
 * @param {unknown} value
 * @returns {value is IfStatement}
 */
export function isIfStatement(value) {
  const ifStatementPattern = /if\s*\(\s*(.*)\s*\)/g;
  return ifStatementPattern.test(value);
}

/**
 * Checks if the value is a ${var-name}.
 * @param {unknown} value
 * @returns {value is variable}
 */
export const isDollarVar = value =>
  (value.length > 0 && value[0] === "$") || value.includes(".$");

/**
 * Checks if the selector is nested property.
 * @param {unknown} selector
 * @returns {selector is variable}
 */
export const isNestedProperty = selector =>
  selector[selector.length - 1] === ":";
