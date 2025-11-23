"use strict";

const valueParser = require("postcss-value-parser");
const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("dollar-variable-no-missing-interpolation");

const messages = utils.ruleMessages(ruleName, {
  rejected: (n, v) =>
    `Expected variable ${v} to be interpolated when using it with ${n}`
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
};

const SCSS_VARIABLE_PATTERN = /\$[a-zA-Z0-9_-]+/g;

// https://developer.mozilla.org/en/docs/Web/CSS/custom-ident#Lists_of_excluded_values
const customIdentProps = [
  "animation",
  "animation-name",
  "counter-reset",
  "counter-increment",
  "list-style-type",
  "will-change"
];

// https://developer.mozilla.org/en/docs/Web/CSS/At-rule
const customIdentAtRules = ["counter-style", "keyframes", "supports"];

function isAtRule(type) {
  return type === "atrule";
}

function isCustomIdentAtRule(node) {
  return isAtRule(node.type) && customIdentAtRules.includes(node.name);
}

function isCustomIdentProp(node) {
  return customIdentProps.includes(node.prop);
}

function isAtSupports(node) {
  return isAtRule(node.type) && node.name === "supports";
}

function isCustomProperty(node) {
  return node.prop && node.prop.startsWith("--");
}

/**
 * Check if a variable at the given index is inside an interpolation block.
 *
 * Variables inside #{...} blocks are already interpolated and should not be flagged.
 * For example, in "animation-name: #{$bar} $baz", $bar should not be flagged but $baz should.
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
 * Transforms: "animation-name: $bar" → "animation-name: #{$bar}"
 * Transforms: "animation: $a 5s, $b 3s" → "animation: #{$a} 5s, #{$b} 3s"
 * Preserves: "animation-name: #{$bar}" → "animation-name: #{$bar}" (already interpolated)
 *
 * @param {string} value - The property value to fix
 * @returns {string} The fixed value with all variables interpolated
 */
function fixValue(value) {
  let fixed = value;
  const matches = [...value.matchAll(SCSS_VARIABLE_PATTERN)];

  // Process matches in reverse order to maintain correct string indices.
  // If we processed left-to-right, wrapping "$a" would shift the indices
  // for "$b" in a string like "animation: $a 5s, $b 3s".
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

function isSassVar(value) {
  return value[0] === "$";
}

function isStringVal(value) {
  return /^(["']).*(["'])$/.test(value);
}

function toRegex(arr) {
  return new RegExp(`(${arr.join("|")})`);
}

/**
 * Rule implementation: Check for SCSS variables that need interpolation in four scenarios:
 *
 * 1. String-valued variables with custom identifier properties (animation-name, counter-reset, etc.)
 * 2. All variables in custom identifier at-rules (@keyframes, @counter-style)
 * 3. String-valued variables in @supports conditions with custom identifier properties
 * 4. All variables in CSS custom properties (--*)
 *
 * @param {boolean} actual - Primary option (always true for this rule)
 * @param {object} secondaryOptions - Secondary options (unused)
 * @param {object} context - Context object with fix/newline flags
 * @returns {function} PostCSS plugin function
 */
function rule(actual, secondaryOptions, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    const stringVars = [];
    const vars = [];
    const reportedNodes = new Set();

    function findVars(node) {
      node.walkDecls(decl => {
        const { prop, value } = decl;

        if (!isSassVar(prop) || vars.includes(prop)) {
          return;
        }

        if (isStringVal(value)) {
          stringVars.push(prop);
        }

        vars.push(prop);
      });
    }

    findVars(root);
    root.walkRules(findVars);

    if (!vars.length) {
      return;
    }

    function shouldReport(node, value) {
      if (isAtSupports(node) || isCustomIdentProp(node)) {
        return stringVars.includes(value);
      }

      if (isCustomIdentAtRule(node)) {
        return vars.includes(value);
      }

      // CSS custom properties always require interpolation for all variables
      if (isCustomProperty(node)) {
        return vars.includes(value);
      }

      return false;
    }

    function report(node, value) {
      const { name, prop, type } = node;
      const nodeName = isAtRule(type) ? `@${name}` : prop;

      // Only provide fix function if we haven't already fixed this node
      utils.report({
        ruleName,
        result,
        node,
        message: messages.rejected(nodeName, value),
        word: value,
        fix:
          context.fix || context.newline
            ? () => {
                // Apply the fix by wrapping all variables in the value
                if (type === "atrule") {
                  node.params = fixValue(node.params);
                } else {
                  node.value = fixValue(node.value);
                }
              }
            : null
      });
    }

    function exitEarly(node) {
      return node.type !== "word" || !node.value;
    }

    function walkValues(node, value) {
      // Skip if we've already reported this node
      if (reportedNodes.has(node)) {
        return;
      }

      let foundVariable = null;

      valueParser(value).walk(valNode => {
        const { value: varValue } = valNode;

        if (exitEarly(valNode) || !shouldReport(node, varValue)) {
          return;
        }

        // Store the first variable we find for reporting
        if (!foundVariable) {
          foundVariable = varValue;
        }
      });

      // Only report once per node, using the first variable found
      if (foundVariable) {
        reportedNodes.add(node);
        report(node, foundVariable, value);
      }
    }

    root.walkDecls(toRegex(customIdentProps), decl => {
      walkValues(decl, decl.value);
    });

    root.walkAtRules(toRegex(customIdentAtRules), atRule => {
      walkValues(atRule, atRule.params);
    });

    // Check all declarations for CSS custom properties (--*)
    root.walkDecls(decl => {
      if (isCustomProperty(decl)) {
        walkValues(decl, decl.value);
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
