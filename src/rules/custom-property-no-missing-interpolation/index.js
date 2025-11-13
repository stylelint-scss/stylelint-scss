"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("custom-property-no-missing-interpolation");

const messages = utils.ruleMessages(ruleName, {
  expected: variable =>
    `SCSS variables in custom properties require interpolation: use #{${variable}} instead of ${variable}`
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
};

const SCSS_VARIABLE_PATTERN = /\$[a-zA-Z0-9_-]+/g;

/**
 * Check if a variable at the given index is inside an interpolation block.
 *
 * Variables inside #{...} blocks are already interpolated and should not be flagged.
 * For example, in "--foo: #{$bar} $baz", $bar should not be flagged but $baz should.
 *
 * This function handles nested interpolation blocks by tracking depth.
 * For example: #{outer(#{inner($var)})} - $var is correctly detected as interpolated.
 *
 * @param {string} value - The full property value string
 * @param {number} variableIndex - The index where the variable starts
 * @returns {boolean} True if the variable is inside a #{...} block
 */
function isInsideInterpolationBlock(value, variableIndex) {
  let depth = 0;
  let insideBlock = false;

  // Scan from the start of the value up to the variable position
  for (let i = 0; i < variableIndex; i++) {
    if (value[i] === "#" && value[i + 1] === "{") {
      depth++;
      insideBlock = true;
      i++; // Skip the '{' to avoid double-counting
    } else if (value[i] === "}") {
      depth--;
      // istanbul ignore else
      if (depth === 0) {
        insideBlock = false;
      }
    }
  }

  return insideBlock && depth > 0;
}

/**
 * Wrap all uninterpolated SCSS variables in the value with interpolation syntax.
 *
 * Transforms: "--foo: $bar" → "--foo: #{$bar}"
 * Transforms: "--foo: calc($a + $b)" → "--foo: calc(#{$a} + #{$b})"
 * Preserves: "--foo: #{$bar}" → "--foo: #{$bar}" (already interpolated)
 *
 * @param {string} value - The property value to fix
 * @returns {string} The fixed value with all variables interpolated
 */
function fixValue(value) {
  let fixed = value;
  const matches = [...value.matchAll(SCSS_VARIABLE_PATTERN)];

  // Process matches in reverse order to maintain correct string indices.
  // If we processed left-to-right, wrapping "$a" would shift the indices
  // for "$b" in a string like "calc($a + $b)".
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const variable = match[0];
    const varIndex = match.index;

    if (isInsideInterpolationBlock(value, varIndex)) continue;

    // Wrap the variable with interpolation syntax: $var → #{$var}
    fixed =
      fixed.slice(0, varIndex) +
      `#{${variable}}` +
      fixed.slice(varIndex + variable.length);
  }

  return fixed;
}

/**
 * Rule implementation: Check custom properties for uninterpolated SCSS variables.
 *
 * SCSS variables in CSS custom properties must be wrapped in interpolation syntax #{...}
 * to be evaluated. Without interpolation, the variable is output as a literal string.
 *
 * Example problem:
 *   $spacing: 2rem;
 *   --gap: $spacing;  // Outputs as "--gap: $spacing;" (wrong!)
 *
 * Correct usage:
 *   --gap: #{$spacing};  // Outputs as "--gap: 2rem;" (correct!)
 *
 * @param {boolean} primary - Primary option (always true for this rule)
 * @param {object} secondaryOptions - Secondary options (unused)
 * @param {object} context - Context object with fix/newline flags
 * @returns {function} PostCSS plugin function
 */
function rule(primary, secondaryOptions, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: [true]
    });

    // istanbul ignore if
    if (!validOptions) {
      return;
    }

    // Walk through all declarations in the stylesheet
    root.walkDecls(decl => {
      // Only check custom properties (CSS variables starting with --)
      // Regular properties like "color: $var" are fine in SCSS
      if (!decl.prop.startsWith("--")) {
        return;
      }

      const matches = [...decl.value.matchAll(SCSS_VARIABLE_PATTERN)];

      for (const match of matches) {
        const variable = match[0];
        const varIndex = match.index;

        // Don't flag variables that are already interpolated
        // Example: "--foo: #{$bar}" is correct, skip it
        if (isInsideInterpolationBlock(decl.value, varIndex)) {
          continue;
        }

        // Report the violation with optional autofix
        utils.report({
          message: messages.expected(variable),
          node: decl,
          result,
          ruleName,
          word: variable, // Highlight the specific variable in error output
          fix:
            context.fix || context.newline
              ? () => {
                  // Apply the fix by wrapping all variables in the value
                  decl.value = fixValue(decl.value);
                }
              : null
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
