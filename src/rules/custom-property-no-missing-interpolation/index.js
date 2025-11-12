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

function isInsideInterpolationBlock(value, variableIndex) {
  // Check if this variable is inside a #{...} block
  let depth = 0;
  let insideBlock = false;

  for (let i = 0; i < variableIndex; i++) {
    if (value[i] === "#" && value[i + 1] === "{") {
      depth++;
      insideBlock = true;
      i++; // Skip the '{'
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

function fixValue(value) {
  let fixed = value;
  const matches = [...value.matchAll(SCSS_VARIABLE_PATTERN)];

  // Process in reverse to maintain correct indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const variable = match[0];
    const varIndex = match.index;

    if (isInsideInterpolationBlock(value, varIndex)) continue;

    fixed =
      fixed.slice(0, varIndex) +
      `#{${variable}}` +
      fixed.slice(varIndex + variable.length);
  }

  return fixed;
}

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

    root.walkDecls(decl => {
      // Only check custom properties (CSS variables starting with --)
      if (!decl.prop.startsWith("--")) {
        return;
      }

      const matches = [...decl.value.matchAll(SCSS_VARIABLE_PATTERN)];

      for (const match of matches) {
        const variable = match[0];
        const varIndex = match.index;

        if (isInsideInterpolationBlock(decl.value, varIndex)) {
          continue;
        }

        utils.report({
          message: messages.expected(variable),
          node: decl,
          result,
          ruleName,
          word: variable,
          fix:
            context.fix || context.newline
              ? () => {
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
