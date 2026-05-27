import { ParseErrorMessage, calcFromComponentValues } from "@csstools/css-calc";
import { TokenType, tokenize } from "@csstools/css-tokenizer";
import { lexer as cssTreelexer, find, fork, parse, string } from "css-tree";
import {
  isFunctionNode,
  parseListOfComponentValues,
  stringify,
  walk
} from "@csstools/css-parser-algorithms";
import stylelint from "stylelint";

import { atRuleRegexes, mayIncludeRegexes } from "../../utils/regexes.js";
import { isAtRule, isDeclaration } from "../../utils/typeGuards.js";
import {
  isDollarVar,
  isFunctionCall,
  isIfStatement,
  isNestedProperty,
  isRegExp,
  isString
} from "../../utils/validateTypes.js";
import declarationValueIndex from "../../utils/declarationValueIndex.js";
import findOperators from "../../utils/sassValueParser/index.js";
import getDeclarationValue from "../../utils/getDeclarationValue.js";
import isCustomProperty from "../../utils/isCustomPropertySet.js";
import isDescriptorDeclaration from "../../utils/isDescriptorDeclaration.js";
import isStandardSyntaxDeclaration from "../../utils/isStandardSyntaxDeclaration.js";
import isStandardSyntaxProperty from "../../utils/isStandardSyntaxProperty.js";
import isStandardSyntaxValue from "../../utils/isStandardSyntaxValue.js";
import namespace from "../../utils/namespace.js";
import { nestingSupportedAtKeywords } from "../../utils/atKeywords.js";
import optionsMatchesEntry from "../../utils/optionsMatchesEntry.js";
import { parseFunctionArguments } from "../../utils/parseFunctionArguments.js";
import ruleUrl from "../../utils/ruleUrl.js";
import syntaxPatchesJson from "@csstools/css-syntax-patches-for-csstree" with { type: "json" };
import validateObjectWithArrayProps from "../../utils/validateObjectWithArrayProps.js";
import validateObjectWithProps from "../../utils/validateObjectWithProps.js";

const { next: syntaxPatches } = syntaxPatchesJson;

const { utils } = stylelint;

const ruleName = namespace("declaration-property-value-no-unknown");

const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Unknown value "${value}" for property "${property}"`,
  rejectedParseError: (property, value) =>
    `Cannot parse property value "${value}" for property "${property}"`,
  rejectedMath: (property, expression) =>
    `Invalid math expression "${expression}" for property "${property}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

const SYNTAX_DESCRIPTOR = /^syntax$/i;

const UNSUPPORTED_FUNCTIONS_IN_CSSTREE = new Set([
  "clamp",
  "min",
  "max",
  "env"
]);

/** @type {WeakMap<object, Set<string>>} */
const validMatchesCacheByLexer = new WeakMap();
const MAX_CACHE_SIZE = 10000;

function extractFunctionName(inputString) {
  const matches = [...inputString.matchAll(/(?:\s*([\w\-$]+)\s*)?\(/g)].flat();

  return matches;
}

function hasDollarVarArg(functionCall) {
  for (const i of parseFunctionArguments(functionCall)) {
    if (isFunctionCall(i.value)) return hasDollarVarArg(i.value);

    if (isDollarVar(i.value)) return true;
  }

  return false;
}

const mathOperators = ["+", "/", "-", "*", "%"];

const rule = (primary, secondaryOptions) => {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      { actual: primary },
      {
        actual: secondaryOptions,
        possible: {
          ignoreProperties: [validateObjectWithArrayProps(isString, isRegExp)],
          propertiesSyntax: [validateObjectWithProps(isString)],
          typesSyntax: [validateObjectWithProps(isString)]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    /** @type {(name: string, propValue: string) => boolean} */
    const isPropIgnored = (name, value) =>
      optionsMatchesEntry(secondaryOptions, "ignoreProperties", name, value);

    const propertiesSyntax = {
      ...syntaxPatches.properties,
      ...secondaryOptions?.propertiesSyntax
    };
    const typesSyntax = {
      ...syntaxPatches.types,
      // Sass supports rgba(color, alpha).
      // https://sass-lang.com/documentation/modules/#rgb
      "rgba()": "| rgba( <hex-color> , <alpha-value>? )",
      ...secondaryOptions?.typesSyntax
    };

    /** @type {Map<string, string>} */
    const typedCustomPropertyNames = new Map();

    // Unless we tracked return values of declared functions, they're all valid.
    root.walkAtRules("function", atRule => {
      UNSUPPORTED_FUNCTIONS_IN_CSSTREE.add(
        extractFunctionName(atRule.params)[1]
      );
    });

    root.walkAtRules(atRuleRegexes.propertyName, atRule => {
      const propName = atRule.params.trim();

      if (!propName || !atRule.nodes || !isCustomProperty(propName)) return;

      for (const node of atRule.nodes) {
        if (isDeclaration(node) && SYNTAX_DESCRIPTOR.test(node.prop)) {
          const value = node.value.trim();
          const unquoted = string.decode(value);

          // Only string values are valid.
          // We can not check the syntax of this property.
          if (unquoted === value) continue;

          // Any value is allowed in this custom property.
          // We don't need to check this property.
          if (unquoted === "*") continue;

          // https://github.com/csstree/csstree/pull/256
          // We can circumvent this issue by prefixing the property name,
          // making it a vendor-prefixed property instead of a custom property.
          // No one should be using `-stylelint--` as a property prefix.
          //
          // When this is resolved `typedCustomPropertyNames` can become a `Set<string>`
          // and the prefix can be removed.
          const prefixedPropName = `-stylelint${propName}`;

          typedCustomPropertyNames.set(propName, prefixedPropName);
          propertiesSyntax[prefixedPropName] = unquoted;
        }
      }
    });

    const forkedLexer = fork({
      properties: propertiesSyntax,
      types: typesSyntax
    }).lexer;

    let validMatchesCache = validMatchesCacheByLexer.get(forkedLexer);

    if (!validMatchesCache) {
      validMatchesCache = new Set();
      validMatchesCacheByLexer.set(forkedLexer, validMatchesCache);
    }

    root.walkDecls(decl => {
      let { prop } = decl;
      const { parent } = decl;
      const value = getDeclarationValue(decl).replace(/\n\s+/, " "); // Strip multiline values.

      // Handle nested properties by reasigning `prop` to the compound property.
      if (
        (parent.selector && isNestedProperty(parent.selector)) ||
        parent.type === "decl"
      ) {
        let pointer = parent;
        let parentSelector = pointer.selector
          ? pointer.selector
              .split(" ")
              ?.filter(sel => sel[sel.length - 1] === ":")[0]
          : parent.prop;

        prop = String(decl.prop);
        while (parentSelector && parentSelector.substring(0, 2) !== "--") {
          prop = `${parentSelector.replace(":", "")}-${prop}`;
          pointer = pointer.parent;
          parentSelector = pointer.selector
            ? pointer.selector
                .split(" ")
                .filter(sel => sel[sel.length - 1] === ":")[0]
            : pointer.prop;
        }
      }

      // csstree/csstree#243
      // NOTE: CSSTree's `fork()` doesn't support `-moz-initial`, but it may be possible in the future.
      if (/^-moz-initial$/i.test(value)) return;

      if (!isStandardSyntaxDeclaration(decl)) return;

      if (isDescriptorDeclaration(decl)) return;

      if (!isStandardSyntaxProperty(prop)) return;

      if (!isStandardSyntaxValue(value)) return;

      if (isCustomProperty(prop) && !typedCustomPropertyNames.has(prop)) return;

      if (isPropIgnored(prop, value)) return;

      // TODO: csstree treats any value containing `var()` as valid, even if the `var()` expression itself is invalid.
      // csstree should be updated to mark invalidate values that contain invalid `var()` expressions.
      // skipping parsing by returning early until this is resolved upstream.
      if (/\bvar\s*\(/i.test(value)) return;

      const cacheKey = isCustomProperty(prop) ? null : `${prop}:${value}`;

      if (cacheKey && validMatchesCache.has(cacheKey)) return;

      // Unless we tracked values of variables, they're all valid.
      if (value.match(/\$[\w-]+/)?.some(isDollarVar)) return;

      if (value.split(" ").some(val => hasDollarVarArg(val))) return;

      if (value.split(" ").some(val => containsCustomFunction(val))) return;

      // Check if value contains math functions that need validation
      const [
        mathFuncResult,
        mathFuncResultStartOffset,
        mathFuncResultEndOffset
      ] = validateMathFunctions(
        value,
        prop,
        forkedLexer,
        typedCustomPropertyNames
      );

      if (mathFuncResult === "valid" || mathFuncResult === "skip-validation") {
        if (cacheKey && validMatchesCache.size < MAX_CACHE_SIZE)
          validMatchesCache.add(cacheKey);

        return;
      }

      if (mathFuncResult === "invalid") {
        const valueIndex = declarationValueIndex(decl);

        let expression = value;
        let index = valueIndex;
        let endIndex = index + expression.length;

        if (
          mathFuncResultStartOffset !== -1 &&
          mathFuncResultEndOffset !== -1
        ) {
          expression = value.slice(
            mathFuncResultStartOffset,
            mathFuncResultEndOffset
          );

          index = valueIndex + mathFuncResultStartOffset;
          endIndex = index + expression.length;
        }

        utils.report({
          message: messages.rejectedMath,
          messageArgs: [prop, expression],
          node: decl,
          index,
          endIndex,
          result,
          ruleName
        });

        return;
      }

      /** @type {CssNode} */
      let cssTreeValueNode;

      try {
        cssTreeValueNode = parse(value, { context: "value", positions: true });

        if (containsCustomFunction(cssTreeValueNode)) return;

        if (containsFunctionsNotSupportedInCSSTree(cssTreeValueNode)) return;
      } catch {
        const index = declarationValueIndex(decl);
        const endIndex = index + value.length;

        // Ignore parse errors for `attr()`, `if()` and custom functions
        // See: https://github.com/stylelint/stylelint/issues/8779
        if (/(?:^|[^\w-])(?:attr|if|--[\w-]+)\(/i.test(value)) return;

        // Hidden declarations
        if (isIfStatement(value)) return;

        if (hasDollarVarArg(value)) return;

        if (containsNamespacedFunction(value)) return;

        const operators = findOperators({ string: value }).map(o => o.symbol);

        for (const operator of operators) {
          if (mathOperators.includes(operator)) {
            return;
          }
        }

        utils.report({
          message: messages.rejectedParseError,
          messageArgs: [prop, value],
          node: decl,
          index,
          endIndex,
          result,
          ruleName
        });

        return;
      }

      const { error } =
        parent &&
        isAtRule(parent) &&
        !nestingSupportedAtKeywords.has(parent.name.toLowerCase())
          ? forkedLexer.matchAtruleDescriptor(
              parent.name,
              prop,
              cssTreeValueNode
            )
          : forkedLexer.matchProperty(
              typedCustomPropertyNames.get(prop) ?? prop,
              cssTreeValueNode
            );

      if (!error) {
        if (cacheKey && validMatchesCache.size < MAX_CACHE_SIZE)
          validMatchesCache.add(cacheKey);

        return;
      }

      if (!("mismatchLength" in error)) return;

      const { name, rawMessage, loc } = error;

      if (name !== "SyntaxMatchError") return;

      if (rawMessage !== "Mismatch") return;

      const valueIndex = declarationValueIndex(decl);
      const mismatchValue = value.slice(loc.start.offset, loc.end.offset);
      const operators = findOperators({ string: value }).map(o => o.symbol);

      for (const operator of operators) {
        if (mathOperators.includes(operator)) {
          return;
        }
      }

      const functionNode = find(
        cssTreeValueNode,
        node =>
          node.type === "Function" &&
          node.loc !== undefined &&
          loc.start.offset >= node.loc.start.offset &&
          loc.end.offset <= node.loc.end.offset
      );

      if (functionNode?.loc) {
        const valueFunction = value.slice(
          functionNode.loc.start.offset,
          functionNode.loc.end.offset
        );

        const index = valueIndex + functionNode.loc.start.offset;
        const endIndex = index + valueFunction.length;

        utils.report({
          message: messages.rejected,
          messageArgs: [prop, valueFunction],
          node: decl,
          index,
          endIndex,
          result,
          ruleName
        });

        return;
      }

      utils.report({
        message: messages.rejected,
        messageArgs: [prop, mismatchValue],
        node: decl,
        index: valueIndex + loc.start.offset,
        endIndex: valueIndex + loc.end.offset,
        result,
        ruleName
      });
    });
  };
};

/**
 * @see csstree/csstree#245 env
 * @param {import('css-tree').CssNode} cssTreeNode
 * @returns {boolean}
 */
function containsFunctionsNotSupportedInCSSTree(cssTreeNode) {
  return Boolean(
    find(
      cssTreeNode,
      node =>
        node.type === "Function" &&
        UNSUPPORTED_FUNCTIONS_IN_CSSTREE.has(node.name.toLowerCase())
    )
  );
}

function containsCustomFunction(cssTreeNode) {
  return Boolean(
    /[\w-]+\.[\w-]+\(.*\)/.test(cssTreeNode) ||
    find(
      cssTreeNode,
      node =>
        node.type === "Function" &&
        (UNSUPPORTED_FUNCTIONS_IN_CSSTREE.has(node.name.toLowerCase()) ||
          !cssTreelexer.types[`${node.name}()`])
    )
  );
}

/**
 * Check if a value contains a namespaced function call.
 * @param {string} value
 * @returns {boolean}
 */
function containsNamespacedFunction(value) {
  return /[\w-]+\.[\w-]+\(/.test(value);
}

/**
 * Detect `calc-size()` with the `size` keyword in its arguments.
 *
 * @param {Array<import('@csstools/css-parser-algorithms').ComponentValue>} componentValues
 * @returns {boolean}
 */
function containsCalcSizeWithSizeKeyword(componentValues) {
  let contains = false;

  walk(componentValues, ({ node }) => {
    if (!isFunctionNode(node) || node.getName().toLowerCase() !== "calc-size")
      return;

    contains = node
      .tokens()
      .some(
        token =>
          token[0] === TokenType.Ident &&
          token[4]?.value.toLowerCase() === "size"
      );

    if (contains) return false; // halt
  });

  return contains;
}

/**
 * Validate math functions (calc, min, max, clamp, etc.) in a CSS value.
 * Uses @csstools/css-calc to solve expressions and validate the result.
 *
 * @param {string} value - The CSS property value
 * @param {string} prop - The property name
 * @param {ReturnType<import('css-tree')['fork']>['lexer']} lexer - The csstree lexer
 * @param {Map<string, string>} typedCustomPropertyNames - Map of typed custom property names
 * @returns {['undetermined' | 'valid' | 'invalid' | 'skip-validation', number, number]} - The validation result
 */
function validateMathFunctions(value, prop, lexer, typedCustomPropertyNames) {
  // If the value doesn't contain any math functions, continue with normal validation
  if (!mayIncludeRegexes.mathFunction.test(value))
    return ["undetermined", -1, -1];

  const nodes = parseListOfComponentValues(tokenize({ css: value }), {});

  if (containsCalcSizeWithSizeKeyword(nodes)) {
    return ["skip-validation", -1, -1];
  }

  /** @type {Array<import('@csstools/css-calc').ParseError>} */
  const calcParseErrors = [];

  // Try to solve the math expression
  const solvedNodes = calcFromComponentValues([nodes], {
    onParseError: err => {
      calcParseErrors.push(err);
    }
  });

  // Check if any known errors were detected during parsing
  for (const calcParseError of calcParseErrors) {
    switch (calcParseError.message) {
      case ParseErrorMessage.UnexpectedAdditionOfDimensionOrPercentageWithNumber:
      case ParseErrorMessage.UnexpectedSubtractionOfDimensionOrPercentageWithNumber:
        return [
          "invalid",
          calcParseError.sourceStart,
          calcParseError.sourceEnd + 1
        ];

      default:
        break;
    }
  }

  const solvedValue = stringify(solvedNodes);

  // For other cases where calc can't be fully solved (like 100% - 10px),
  // skip validation and let csstree handle it (csstree allows these)
  if (mayIncludeRegexes.mathFunction.test(solvedValue)) {
    return ["undetermined", -1, -1];
  }

  // If the expression was fully solved (no more math functions),
  // validate the result with csstree
  try {
    const solvedCssTreeNode = parse(solvedValue, {
      context: "value",
      positions: true
    });

    if (containsFunctionsNotSupportedInCSSTree(solvedCssTreeNode)) {
      return ["skip-validation", -1, -1];
    }

    const { error } = lexer.matchProperty(
      typedCustomPropertyNames.get(prop) ?? prop,
      solvedCssTreeNode
    );

    // If the solved value is valid, skip further validation
    if (!error) return ["valid", -1, -1];

    // If the solved value is invalid, it means the calc result type doesn't match the property
    // e.g., calc(2) for height: results in a number "2", but height expects a length
    if (
      "mismatchLength" in error &&
      error.name === "SyntaxMatchError" &&
      error.rawMessage === "Mismatch"
    ) {
      const startOffset = error.loc.start.offset;
      const endOffset = error.loc.end.offset;

      // Lookup the original source position of the invalid expression
      // by finding the tokens that correspond to the positions reported by csstree
      const solvedTokens = solvedNodes.flatMap(componentValues =>
        componentValues.flatMap(node => node.tokens())
      );
      let counter = 0;
      let startToken;
      let endToken;

      solvedTokens.forEach(token => {
        if (startOffset === counter) {
          startToken = token;
        }

        counter += token[1].length;

        if (endOffset === counter) {
          endToken = token;
        }
      });

      if (!startToken || !endToken) return ["invalid", -1, -1];

      return ["invalid", startToken[2], endToken[3] + 1];
    }
  } catch {
    // If parsing fails, continue with normal validation
    return ["undetermined", -1, -1];
  }

  return ["undetermined", -1, -1];
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
