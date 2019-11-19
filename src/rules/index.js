"use strict";

const atEachKeyValue = require("./at-each-key-value-single-line").rule;
const atElseClosingBraceNewlineAfter = require("./at-else-closing-brace-newline-after")
  .rule;
const atElseClosingBraceSpaceAfter = require("./at-else-closing-brace-space-after")
  .rule;
const atElseEmptyLineBefore = require("./at-else-empty-line-before").rule;
const atElseIfParenthesesSpaceBefore = require("./at-else-if-parentheses-space-before")
  .rule;
const atExtendNoMissingPlaceholder = require("./at-extend-no-missing-placeholder")
  .rule;
const atFunctionNamedArguments = require("./at-function-named-arguments").rule;
const atFunctionParenthesesSpaceBefore = require("./at-function-parentheses-space-before")
  .rule;
const atFunctionPattern = require("./at-function-pattern").rule;
const atIfClosingBraceNewlineAfter = require("./at-if-closing-brace-newline-after")
  .rule;
const atIfClosingBraceSpaceAfter = require("./at-if-closing-brace-space-after")
  .rule;
const atIfNoNull = require("./at-if-no-null").rule;
const atImportNoPartialLeadingUnderscore = require("./at-import-no-partial-leading-underscore")
  .rule;
const atImportPartialExtension = require("./at-import-partial-extension").rule;
const atImportPartialExtensionBlacklist = require("./at-import-partial-extension-blacklist")
  .rule;
const atImportPartialExtensionWhitelist = require("./at-import-partial-extension-whitelist")
  .rule;
const atMixinArgumentlessCallParentheses = require("./at-mixin-argumentless-call-parentheses")
  .rule;
const atMixinNamedArguments = require("./at-mixin-named-arguments").rule;
const atMixinParenthesesSpaceBefore = require("./at-mixin-parentheses-space-before")
  .rule;
const atMixinPattern = require("./at-mixin-pattern").rule;
const atRuleConditionalNoParen = require("./at-rule-conditional-no-parentheses")
  .rule;
const atRuleNoUnknown = require("./at-rule-no-unknown").rule;
const commentNoLoud = require("./comment-no-loud").rule;
const declarationNestedProperties = require("./declaration-nested-properties")
  .rule;
const declarationNestedPropertiesNoDividedGroups = require("./declaration-nested-properties-no-divided-groups")
  .rule;
const dimensionNoNonNumeric = require("./dimension-no-non-numeric-values").rule;
const dollarVariableColonNewlineAfter = require("./dollar-variable-colon-newline-after")
  .rule;
const dollarVariableColonSpaceAfter = require("./dollar-variable-colon-space-after")
  .rule;
const dollarVariableColonSpaceBefore = require("./dollar-variable-colon-space-before")
  .rule;
const dollarVariableDefault = require("./dollar-variable-default").rule;
const dollarVariableEmptyLineBefore = require("./dollar-variable-empty-line-before")
  .rule;
const dollarVariableNoMissingInterpolation = require("./dollar-variable-no-missing-interpolation")
  .rule;
const dollarVariablePattern = require("./dollar-variable-pattern").rule;
const doubleSlashCommentEmptyLineBefore = require("./double-slash-comment-empty-line-before")
  .rule;
const doubleSlashCommentInline = require("./double-slash-comment-inline").rule;
const doubleSlashCommentWhitespaceInside = require("./double-slash-comment-whitespace-inside")
  .rule;
const functionColorRelative = require("./function-color-relative").rule;
const functionNoQuotedStrings = require("./function-quote-no-quoted-strings-inside")
  .rule;
const functionNoUnquotedStrings = require("./function-unquote-no-unquoted-strings-inside")
  .rule;
const mapKeysQuotes = require("./map-keys-quotes").rule;
const mediaFeatureValueDollarVariable = require("./media-feature-value-dollar-variable")
  .rule;
const noDollarVariables = require("./no-dollar-variables").rule;
const noDuplicateDollarVariables = require("./no-duplicate-dollar-variables")
  .rule;
const noDuplicateMixins = require("./no-duplicate-mixins").rule;
const operatorNoNewlineAfter = require("./operator-no-newline-after").rule;
const operatorNoNewlineBefore = require("./operator-no-newline-before").rule;
const operatorNoUnspaced = require("./operator-no-unspaced").rule;
const partialNoImport = require("./partial-no-import").rule;
const percentPlaceholderPattern = require("./percent-placeholder-pattern").rule;
const selectorNestCombinators = require("./selector-nest-combinators").rule;
const selectorNoRedundantNestingSelector = require("./selector-no-redundant-nesting-selector")
  .rule;
const selectorNoUnionClassName = require("./selector-no-union-class-name").rule;

module.exports = {
  "at-extend-no-missing-placeholder": atExtendNoMissingPlaceholder,
  "at-else-closing-brace-newline-after": atElseClosingBraceNewlineAfter,
  "at-else-closing-brace-space-after": atElseClosingBraceSpaceAfter,
  "at-else-empty-line-before": atElseEmptyLineBefore,
  "at-else-if-parentheses-space-before": atElseIfParenthesesSpaceBefore,
  "at-function-named-arguments": atFunctionNamedArguments,
  "at-function-parentheses-space-before": atFunctionParenthesesSpaceBefore,
  "at-function-pattern": atFunctionPattern,
  "at-if-closing-brace-newline-after": atIfClosingBraceNewlineAfter,
  "at-if-closing-brace-space-after": atIfClosingBraceSpaceAfter,
  "at-if-no-null": atIfNoNull,
  "at-import-no-partial-leading-underscore": atImportNoPartialLeadingUnderscore,
  "at-import-partial-extension": atImportPartialExtension,
  "at-import-partial-extension-blacklist": atImportPartialExtensionBlacklist,
  "at-import-partial-extension-whitelist": atImportPartialExtensionWhitelist,
  "at-mixin-argumentless-call-parentheses": atMixinArgumentlessCallParentheses,
  "at-mixin-named-arguments": atMixinNamedArguments,
  "at-mixin-parentheses-space-before": atMixinParenthesesSpaceBefore,
  "at-mixin-pattern": atMixinPattern,
  "at-each-key-value-single-line": atEachKeyValue,
  "at-rule-conditional-no-parentheses": atRuleConditionalNoParen,
  "at-rule-no-unknown": atRuleNoUnknown,
  "comment-no-loud": commentNoLoud,
  "declaration-nested-properties": declarationNestedProperties,
  "declaration-nested-properties-no-divided-groups": declarationNestedPropertiesNoDividedGroups,
  "dimension-no-non-numeric-values": dimensionNoNonNumeric,
  "dollar-variable-colon-newline-after": dollarVariableColonNewlineAfter,
  "dollar-variable-colon-space-after": dollarVariableColonSpaceAfter,
  "dollar-variable-colon-space-before": dollarVariableColonSpaceBefore,
  "dollar-variable-default": dollarVariableDefault,
  "dollar-variable-empty-line-before": dollarVariableEmptyLineBefore,
  "dollar-variable-no-missing-interpolation": dollarVariableNoMissingInterpolation,
  "dollar-variable-pattern": dollarVariablePattern,
  "double-slash-comment-empty-line-before": doubleSlashCommentEmptyLineBefore,
  "double-slash-comment-inline": doubleSlashCommentInline,
  "double-slash-comment-whitespace-inside": doubleSlashCommentWhitespaceInside,
  "function-quote-no-quoted-strings-inside": functionNoQuotedStrings,
  "function-unquote-no-unquoted-strings-inside": functionNoUnquotedStrings,
  "function-color-relative": functionColorRelative,
  "map-keys-quotes": mapKeysQuotes,
  "media-feature-value-dollar-variable": mediaFeatureValueDollarVariable,
  "no-dollar-variables": noDollarVariables,
  "no-duplicate-dollar-variables": noDuplicateDollarVariables,
  "no-duplicate-mixins": noDuplicateMixins,
  "operator-no-newline-after": operatorNoNewlineAfter,
  "operator-no-newline-before": operatorNoNewlineBefore,
  "operator-no-unspaced": operatorNoUnspaced,
  "percent-placeholder-pattern": percentPlaceholderPattern,
  "partial-no-import": partialNoImport,
  "selector-nest-combinators": selectorNestCombinators,
  "selector-no-redundant-nesting-selector": selectorNoRedundantNestingSelector,
  "selector-no-union-class-name": selectorNoUnionClassName
};
