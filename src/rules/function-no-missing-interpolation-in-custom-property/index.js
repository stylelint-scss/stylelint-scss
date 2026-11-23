import { ALL_FUNCTIONS } from "../../utils/functions.js";
import declarationValueIndex from "../../utils/declarationValueIndex.js";
import isNativeCssFunction from "../../utils/isNativeCssFunction.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

const { utils } = stylelint;

const ruleName = namespace(
  "function-no-missing-interpolation-in-custom-property"
);

const messages = utils.ruleMessages(ruleName, {
  rejected: (functionName, property) =>
    `Expected function "${functionName}" to be interpolated when using it with ${property}`
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
};

const NAMESPACED_FUNCTION_PATTERN = /^[\w-]+\.[\w-]+$/;

/**
 * Global Sass functions that don't share their name with a native CSS
 * function. `if()` is excluded as well, since it is also a CSS function.
 */
const GLOBAL_SASS_FUNCTIONS = new Set(
  ALL_FUNCTIONS.filter(
    name => !name.includes(".") && name !== "if" && !isNativeCssFunction(name)
  )
);

function isCustomProperty(decl) {
  return decl.prop.startsWith("--");
}

/**
 * Sass treats hyphens and underscores in names as the same character.
 */
function normalizeName(name) {
  return name.replace(/_/g, "-");
}

function getLocalFunctions(root) {
  const localFunctions = new Set();

  root.walkAtRules(/^function$/i, atRule => {
    const matched = atRule.params.match(/^\s*([^\s(]+)/);

    if (matched) {
      localFunctions.add(normalizeName(matched[1]));
    }
  });

  return localFunctions;
}

/**
 * Check whether the given index of a value is inside a `#{...}` block.
 */
function isInsideInterpolationBlock(value, index) {
  let depth = 0;

  for (let i = 0; i < index; i++) {
    if (value[i] === "#" && value[i + 1] === "{") {
      depth++;
      i++;
    } else if (value[i] === "}" && depth > 0) {
      depth--;
    }
  }

  return depth > 0;
}

function isSassFunction(name, localFunctions) {
  return (
    NAMESPACED_FUNCTION_PATTERN.test(name) ||
    GLOBAL_SASS_FUNCTIONS.has(name) ||
    localFunctions.has(normalizeName(name))
  );
}

/**
 * Find the outermost Sass function calls that are not interpolated.
 */
function findUninterpolatedFunctions(value, localFunctions) {
  const functions = [];

  valueParser(value).walk(node => {
    if (node.type !== "function") return;

    // e.g. `#{map.get($a, b)}` is parsed as a function named `#{map.get`
    if (node.value.startsWith("#{")) return false;

    if (!isSassFunction(node.value, localFunctions)) return;

    if (isInsideInterpolationBlock(value, node.sourceIndex)) return false;

    functions.push(node);

    // Wrapping the outermost function call interpolates the nested ones too.
    return false;
  });

  return functions;
}

function wrapWithInterpolation(value, functions) {
  let fixed = value;

  // Process in reverse order to keep the indices of earlier nodes valid.
  for (let i = functions.length - 1; i >= 0; i--) {
    const { sourceIndex, sourceEndIndex } = functions[i];

    fixed = `${fixed.slice(0, sourceIndex)}#{${fixed.slice(
      sourceIndex,
      sourceEndIndex
    )}}${fixed.slice(sourceEndIndex)}`;
  }

  return fixed;
}

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    const localFunctions = getLocalFunctions(root);

    root.walkDecls(decl => {
      if (!isCustomProperty(decl)) return;

      const functions = findUninterpolatedFunctions(decl.value, localFunctions);

      if (functions.length === 0) return;

      const valueIndex = declarationValueIndex(decl);

      const fix = () => {
        decl.value = wrapWithInterpolation(
          decl.value,
          findUninterpolatedFunctions(decl.value, localFunctions)
        );
      };

      functions.forEach(node => {
        utils.report({
          ruleName,
          result,
          node: decl,
          message: messages.rejected(node.value, decl.prop),
          index: valueIndex + node.sourceIndex,
          endIndex: valueIndex + node.sourceIndex + node.value.length,
          fix
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
