"use strict";

const cssTree = require("css-tree");
const isPlainObject = require("is-plain-object");
const typeGuards = require("../../utils/typeGuards.js");
const declarationValueIndex = require("../../utils/declarationValueIndex.js");
const isCustomProperty = require("../../utils/isCustomPropertySet.js");
const isStandardSyntaxDeclaration = require("../../utils/isStandardSyntaxDeclaration.js");
const isStandardSyntaxProperty = require("../../utils/isStandardSyntaxProperty.js");
const isStandardSyntaxValue = require("../../utils/isStandardSyntaxValue.js");
const matchesStringOrRegExp = require("../../utils/matchesStringOrRegExp.js");
const atKeywords = require("../../utils/atKeywords.js");
const validateObjectWithArrayProps = require("../../utils/validateObjectWithArrayProps.js");
const { utils } = require("stylelint");
const { isFunctionCall } = require("../../utils/validateTypes");
const findOperators = require("../../utils/sassValueParser");
const {
  parseFunctionArguments
} = require("../../utils/parseFunctionArguments");
const {
  isDollarVar,
  isIfStatement,
  isNestedProperty
} = require("../../utils/validateTypes");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("declaration-property-value-no-unknown");

const messages = utils.ruleMessages(ruleName, {
  rejected: (property, value) =>
    `Unexpected unknown value "${value}" for property "${property}"`,
  rejectedParseError: (property, value) =>
    `Cannot parse property value "${value}" for property "${property}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

const SYNTAX_DESCRIPTOR = /^syntax$/i;

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

const unsupportedFunctions = ["clamp", "min", "max", "env"];
const mathOperators = ["+", "/", "-", "*", "%"];

function rule(primary, secondaryOptions) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      { actual: primary },
      {
        actual: secondaryOptions,
        possible: {
          ignoreProperties: [validateObjectWithArrayProps],
          propertiesSyntax: [isPlainObject.isPlainObject],
          typesSyntax: [isPlainObject.isPlainObject]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const ignoreProperties = Array.from(
      Object.entries(secondaryOptions?.ignoreProperties ?? {})
    );

    /** @type {(name: string, propValue: string) => boolean} */
    const isPropIgnored = (name, value) => {
      const [, valuePattern] =
        ignoreProperties.find(([namePattern]) =>
          matchesStringOrRegExp(name, namePattern)
        ) || [];

      return valuePattern && matchesStringOrRegExp(value, valuePattern);
    };

    const propertiesSyntax = {
      overflow: "| overlay", // csstree/csstree#248
      width:
        "| min-intrinsic | -moz-min-content | -moz-available | -webkit-fill-available", // csstree/csstree#242
      "anchor-name": "none | <custom-property-name>#",
      "field-sizing": "content | fixed",
      "text-box-edge":
        "auto | [ text | cap | ex | ideographic | ideographic-ink ] [ text | alphabetic | ideographic | ideographic-ink ]?",
      "text-box-trim": "none | trim-start | trim-end | trim-both",
      "text-spacing-trim": "normal | space-all | space-first | trim-start",
      "text-wrap-mode": "wrap | nowrap",
      "text-wrap-style": "auto | balance | pretty | stable",
      "text-wrap": "<'text-wrap-mode'> || <'text-wrap-style'>",
      "view-timeline-axis": "[ block | inline | x | y ]#",
      "view-timeline-inset": "[ [ auto | <length-percentage> ]{1,2} ]#",
      "view-timeline-name": "[ none | <custom-property-name> ]#",
      "view-timeline":
        "[ <'view-timeline-name'> [ <'view-timeline-axis'> || <'view-timeline-inset'> ]? ]#",
      // <custom-ident> represents any valid CSS identifier that would not be misinterpreted as a pre-defined keyword in that property’s value definition
      // i.e. reserved keywords don't have to be excluded explicitly
      // w3c/csswg-drafts#9895
      "view-transition-name": "none | <custom-ident>",
      "word-break": "| auto-phrase",
      ...secondaryOptions?.propertiesSyntax
    };
    const typesSyntax = { ...secondaryOptions?.typesSyntax };

    /** @type {Map<string, string>} */
    const typedCustomPropertyNames = new Map();

    // Unless we tracked return values of declared functions, they're all valid.
    root.walkAtRules("function", atRule => {
      unsupportedFunctions.push(extractFunctionName(atRule.params)[1]);
    });

    root.walkAtRules(/^property$/i, atRule => {
      const propName = atRule.params.trim();

      if (!propName || !atRule.nodes || !isCustomProperty(propName)) return;

      for (const node of atRule.nodes) {
        if (
          typeGuards.isDeclaration(node) &&
          SYNTAX_DESCRIPTOR.test(node.prop)
        ) {
          const value = node.value.trim();
          const unquoted = cssTree.string.decode(value);

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

    const forkedLexer = cssTree.fork({
      properties: propertiesSyntax,
      types: typesSyntax
    }).lexer;

    root.walkDecls(decl => {
      const { prop, value, parent } = decl;

      //csstree/csstree#243
      // NOTE: CSSTree's `fork()` doesn't support `-moz-initial`, but it may be possible in the future.
      if (/^-moz-initial$/i.test(value)) return;

      if (!isStandardSyntaxDeclaration(decl)) return;

      if (!isStandardSyntaxProperty(prop)) return;

      if (!isStandardSyntaxValue(value)) return;

      if (isCustomProperty(prop) && !typedCustomPropertyNames.has(prop)) return;

      if (isPropIgnored(prop, value)) return;

      // Unless we tracked values of variables, they're all valid.
      if (value.split(" ").some(val => isDollarVar(val))) return;
      if (value.split(" ").some(val => hasDollarVarArg(val))) return;
      if (value.split(" ").some(val => containsCustomFunction(val))) return;

      // mdn/data#674
      // `initial-value` has an incorrect syntax definition.
      // In reality everything is valid.
      if (
        /^initial-value$/i.test(prop) &&
        decl.parent &&
        typeGuards.isAtRule(decl.parent) &&
        /^property$/i.test(decl.parent.name)
      ) {
        return;
      }

      /** @type {import('css-tree').CssNode} */
      let cssTreeValueNode;

      try {
        cssTreeValueNode = cssTree.parse(value, { context: "value" });

        if (containsCustomFunction(cssTreeValueNode)) return;
        if (containsUnsupportedFunction(cssTreeValueNode)) return;
      } catch (e) {
        const index = declarationValueIndex(decl);
        const endIndex = index + value.length;

        // Hidden declarations
        if (isIfStatement(value)) return;
        if (hasDollarVarArg(value)) return;
        const operators = findOperators({ string: value }).map(o => o.symbol);

        for (const operator of operators) {
          if (mathOperators.includes(operator)) {
            return;
          }
        }

        utils.report({
          message: messages.rejectedParseError(prop, value),
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
        typeGuards.isAtRule(parent) &&
        !atKeywords.nestingSupportedAtKeywords.has(parent.name.toLowerCase())
          ? forkedLexer.matchAtruleDescriptor(
              parent.name,
              prop,
              cssTreeValueNode
            )
          : forkedLexer.matchProperty(
              typedCustomPropertyNames.get(prop) ?? prop,
              cssTreeValueNode
            );

      if (!error) return;

      if (!("mismatchLength" in error)) return;

      const { mismatchLength, mismatchOffset, name, rawMessage } = error;

      if (name !== "SyntaxMatchError") return;

      if (rawMessage !== "Mismatch") return;

      const mismatchValue = value.slice(
        mismatchOffset,
        mismatchOffset + mismatchLength
      );
      const index = declarationValueIndex(decl) + mismatchOffset;
      const endIndex = index + mismatchLength;
      const operators = findOperators({ string: value }).map(o => o.symbol);

      for (const operator of operators) {
        if (mathOperators.includes(operator)) {
          return;
        }
      }

      utils.report({
        message: messages.rejected(prop, mismatchValue),
        node: decl,
        index,
        endIndex,
        result,
        ruleName
      });
    });

    // Handle nested properties
    root.walkRules(node => {
      if (!isNestedProperty(node.selector)) return;
      node.each(decl => {
        let pointer = node;
        let prop = String(decl.prop);
        while (
          pointer &&
          pointer.selector &&
          pointer.selector[pointer.selector.length - 1] === ":" &&
          pointer.selector.substring(0, 2) !== "--"
        ) {
          prop = pointer.selector.replace(":", "") + "-" + prop;
          pointer = pointer.parent;
        }
        const { error } = forkedLexer.matchProperty(prop, String(decl.value));

        if (!error) return;

        utils.report({
          message: messages.rejected(prop, decl.value),
          node,
          result,
          ruleName
        });
      });
    });
  };
}

/**
 *
 * @see csstree/csstree#164 min, max, clamp
 * @see csstree/csstree#245 env
 *
 * @param {import('css-tree').CssNode} cssTreeNode
 * @returns {boolean}
 */
function containsUnsupportedFunction(cssTreeNode) {
  return Boolean(
    cssTree.find(
      cssTreeNode,
      node =>
        node.type === "Function" &&
        ["clamp", "min", "max", "env"].includes(node.name)
    )
  );
}

function containsCustomFunction(cssTreeNode) {
  return Boolean(
    cssTree.find(
      cssTreeNode,
      node =>
        node.type === "Function" && unsupportedFunctions.includes(node.name)
    )
  );
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
