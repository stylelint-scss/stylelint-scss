/** @type {RegExp} Matches leading whitespace */
const LEADING_WHITESPACE = /^\s*/;

/** @type {RegExp} Matches trailing whitespace */
const TRAILING_WHITESPACE = /\s*$/;

/** @type {RegExp} Matches characters that indicate a declaration value (number, dot, $, or quote) */
const DECLARATION_VALUE_START = /^[\d.$'"]/;

/**
 * Attempts to parse a CSS property string as a root for a group of nested
 * properties, e.g. `margin: {`, `font: 10px/1.1 Arial {` ("{" excluded).
 *
 * @param {string} propertyString - The property string to parse
 * @returns {{
 *   propName: { value: string, after: string },
 *   propValue?: { value: string, before: string, sourceIndex: number }
 * } | null} - The parsed result, or null if the property string is not a nested property root
 */
export default function parseNestedPropRoot(propertyString) {
  // Stack of mode strings: "normal" | "interpolation" | "string:'" | 'string:"'
  const stack = ["normal"];

  for (let i = 0; i < propertyString.length; i++) {
    const character = propertyString[i];
    const prevCharacter = propertyString[i - 1];

    // Entering/exiting a string
    if (character === '"' || character === "'") {
      const currentMode = stack.at(-1);
      const stringMode = `string:${character}`;

      if (!currentMode.startsWith("string:")) {
        stack.push(stringMode);
        continue;
      }

      if (currentMode === stringMode && prevCharacter !== "\\") {
        stack.pop();
      }

      continue;
    }

    // Entering/exiting interpolation
    if (character === "{") {
      stack.push("interpolation");
      continue;
    }

    if (character === "}") {
      stack.pop();
      continue;
    }

    // Check for ":" outside string or interpolation. It must either end the
    // property name (no value follows) or have whitespace before the value.
    if (
      stack.at(-1) !== "normal" ||
      character !== ":" ||
      prevCharacter === "\\"
    ) {
      continue;
    }

    const propertyName = propertyString.slice(0, i);
    const rawPropertyValue = propertyString.slice(i + 1);
    const propName = {
      value: propertyName.trim(),
      after: TRAILING_WHITESPACE.exec(propertyName)[0]
    };

    if (rawPropertyValue) {
      const propertyValue = rawPropertyValue.trim();
      const whitespaceBeforeValue =
        LEADING_WHITESPACE.exec(rawPropertyValue)[0];

      // It's a declaration if
      // 1) there is whitespace after ":", or
      // 2) the property value is a number with/without a unit (starts with a number or a dot), or
      // 3) the property value is a variable (starts with "$"), or
      // 4) the property value is a string, surprisingly
      if (
        whitespaceBeforeValue === "" &&
        !DECLARATION_VALUE_START.test(propertyValue)
      ) {
        return null;
      }

      return {
        propName,
        propValue: {
          value: propertyValue,
          before: whitespaceBeforeValue,
          sourceIndex: whitespaceBeforeValue.length + i + 1 // +1 for the colon
        }
      };
    }

    return { propName };
  }

  return null;
}
