import atEachKeyValueSingleLine from "./at-each-key-value-single-line/index.js";
import atElseClosingBraceNewlineAfter from "./at-else-closing-brace-newline-after/index.js";
import atElseClosingBraceSpaceAfter from "./at-else-closing-brace-space-after/index.js";
import atElseEmptyLineBefore from "./at-else-empty-line-before/index.js";
import atElseIfParenthesesSpaceBefore from "./at-else-if-parentheses-space-before/index.js";
import atExtendNoMissingPlaceholder from "./at-extend-no-missing-placeholder/index.js";
import atFunctionNamedArguments from "./at-function-named-arguments/index.js";
import atFunctionParenthesesSpaceBefore from "./at-function-parentheses-space-before/index.js";
import atFunctionPattern from "./at-function-pattern/index.js";
import atIfClosingBraceNewlineAfter from "./at-if-closing-brace-newline-after/index.js";
import atIfClosingBraceSpaceAfter from "./at-if-closing-brace-space-after/index.js";
import atIfNoNull from "./at-if-no-null/index.js";
import loadNoPartialLeadingUnderscore from "./load-no-partial-leading-underscore/index.js";
import loadPartialExtension from "./load-partial-extension/index.js";
import atImportPartialExtensionAllowedList from "./at-import-partial-extension-allowed-list/index.js";
import atImportPartialExtensionDisallowedList from "./at-import-partial-extension-disallowed-list/index.js";
import atMixinArgumentlessCallParentheses from "./at-mixin-argumentless-call-parentheses/index.js";
import atMixinNamedArguments from "./at-mixin-named-arguments/index.js";
import atMixinParenthesesSpaceBefore from "./at-mixin-parentheses-space-before/index.js";
import atMixinPattern from "./at-mixin-pattern/index.js";
import atMixinNoRiskyNestingSelector from "./at-mixin-no-risky-nesting-selector/index.js";
import atRuleConditionalNoParentheses from "./at-rule-conditional-no-parentheses/index.js";
import atRootNoRedundant from "./at-root-no-redundant/index.js";
import atRuleNoUnknown from "./at-rule-no-unknown/index.js";
import atUseNoRedundantAlias from "./at-use-no-redundant-alias/index.js";
import atUseNoUnnamespaced from "./at-use-no-unnamespaced/index.js";
import blockNoRedundantNesting from "./block-no-redundant-nesting/index.js";
import commentNoEmpty from "./comment-no-empty/index.js";
import commentNoLoud from "./comment-no-loud/index.js";
import declarationNestedPropertiesNoDividedGroups from "./declaration-nested-properties-no-divided-groups/index.js";
import declarationNestedProperties from "./declaration-nested-properties/index.js";
import declarationPropertyValueNoUnknown from "./declaration-property-value-no-unknown/index.js";
import dimensionNoNonNumericValues from "./dimension-no-non-numeric-values/index.js";
import dollarVariableColonNewlineAfter from "./dollar-variable-colon-newline-after/index.js";
import dollarVariableColonSpaceAfter from "./dollar-variable-colon-space-after/index.js";
import dollarVariableColonSpaceBefore from "./dollar-variable-colon-space-before/index.js";
import dollarVariableDefault from "./dollar-variable-default/index.js";
import dollarVariableEmptyLineAfter from "./dollar-variable-empty-line-after/index.js";
import dollarVariableEmptyLineBefore from "./dollar-variable-empty-line-before/index.js";
import dollarVariableFirstInBlock from "./dollar-variable-first-in-block/index.js";
import dollarVariableNoMissingInterpolation from "./dollar-variable-no-missing-interpolation/index.js";
import dollarVariableNoNamespacedAssignment from "./dollar-variable-no-namespaced-assignment/index.js";
import dollarVariablePattern from "./dollar-variable-pattern/index.js";
import doubleSlashCommentEmptyLineBefore from "./double-slash-comment-empty-line-before/index.js";
import doubleSlashCommentInline from "./double-slash-comment-inline/index.js";
import doubleSlashCommentWhitespaceInside from "./double-slash-comment-whitespace-inside/index.js";
import functionDisallowedList from "./function-disallowed-list/index.js";
import functionCalculationNoInterpolation from "./function-calculation-no-interpolation/index.js";
import functionColorChannel from "./function-color-channel/index.js";
import functionColorRelative from "./function-color-relative/index.js";
import functionNoUnknown from "./function-no-unknown/index.js";
import functionQuoteNoQuotedStringsInside from "./function-quote-no-quoted-strings-inside/index.js";
import functionUnquoteNoUnquotedStringsInside from "./function-unquote-no-unquoted-strings-inside/index.js";
import mapKeysQuotes from "./map-keys-quotes/index.js";
import mediaFeatureValueDollarVariable from "./media-feature-value-dollar-variable/index.js";
import noDollarVariables from "./no-dollar-variables/index.js";
import noDuplicateDollarVariables from "./no-duplicate-dollar-variables/index.js";
import noDuplicateLoadRules from "./no-duplicate-load-rules/index.js";
import noDuplicateMixins from "./no-duplicate-mixins/index.js";
import noGlobalFunctionNames from "./no-global-function-names/index.js";
import noUnusedPrivateMembers from "./no-unused-private-members/index.js";
import operatorNoNewlineAfter from "./operator-no-newline-after/index.js";
import operatorNoNewlineBefore from "./operator-no-newline-before/index.js";
import operatorNoUnspaced from "./operator-no-unspaced/index.js";
import partialNoImport from "./partial-no-import/index.js";
import percentPlaceholderPattern from "./percent-placeholder-pattern/index.js";
import propertyNoUnknown from "./property-no-unknown/index.js";
import selectorClassPattern from "./selector-class-pattern/index.js";
import selectorNestCombinators from "./selector-nest-combinators/index.js";
import selectorNoRedundantNestingSelector from "./selector-no-redundant-nesting-selector/index.js";
import selectorNoUnionClassName from "./selector-no-union-class-name/index.js";

const rules = {
  "at-each-key-value-single-line": atEachKeyValueSingleLine,
  "at-else-closing-brace-newline-after": atElseClosingBraceNewlineAfter,
  "at-else-closing-brace-space-after": atElseClosingBraceSpaceAfter,
  "at-else-empty-line-before": atElseEmptyLineBefore,
  "at-else-if-parentheses-space-before": atElseIfParenthesesSpaceBefore,
  "at-extend-no-missing-placeholder": atExtendNoMissingPlaceholder,
  "at-function-named-arguments": atFunctionNamedArguments,
  "at-function-parentheses-space-before": atFunctionParenthesesSpaceBefore,
  "at-function-pattern": atFunctionPattern,
  "at-if-closing-brace-newline-after": atIfClosingBraceNewlineAfter,
  "at-if-closing-brace-space-after": atIfClosingBraceSpaceAfter,
  "at-if-no-null": atIfNoNull,
  "load-no-partial-leading-underscore": loadNoPartialLeadingUnderscore,
  "load-partial-extension": loadPartialExtension,
  "at-import-partial-extension-allowed-list":
    atImportPartialExtensionAllowedList,
  "at-import-partial-extension-disallowed-list":
    atImportPartialExtensionDisallowedList,
  "at-mixin-argumentless-call-parentheses": atMixinArgumentlessCallParentheses,
  "at-mixin-named-arguments": atMixinNamedArguments,
  "at-mixin-parentheses-space-before": atMixinParenthesesSpaceBefore,
  "at-mixin-pattern": atMixinPattern,
  "at-mixin-no-risky-nesting-selector": atMixinNoRiskyNestingSelector,
  "at-rule-conditional-no-parentheses": atRuleConditionalNoParentheses,
  "at-root-no-redundant": atRootNoRedundant,
  "at-rule-no-unknown": atRuleNoUnknown,
  "at-use-no-redundant-alias": atUseNoRedundantAlias,
  "at-use-no-unnamespaced": atUseNoUnnamespaced,
  "block-no-redundant-nesting": blockNoRedundantNesting,
  "comment-no-empty": commentNoEmpty,
  "comment-no-loud": commentNoLoud,
  "declaration-nested-properties-no-divided-groups":
    declarationNestedPropertiesNoDividedGroups,
  "declaration-nested-properties": declarationNestedProperties,
  "declaration-property-value-no-unknown": declarationPropertyValueNoUnknown,
  "dimension-no-non-numeric-values": dimensionNoNonNumericValues,
  "dollar-variable-colon-newline-after": dollarVariableColonNewlineAfter,
  "dollar-variable-colon-space-after": dollarVariableColonSpaceAfter,
  "dollar-variable-colon-space-before": dollarVariableColonSpaceBefore,
  "dollar-variable-default": dollarVariableDefault,
  "dollar-variable-empty-line-after": dollarVariableEmptyLineAfter,
  "dollar-variable-empty-line-before": dollarVariableEmptyLineBefore,
  "dollar-variable-first-in-block": dollarVariableFirstInBlock,
  "dollar-variable-no-missing-interpolation":
    dollarVariableNoMissingInterpolation,
  "dollar-variable-no-namespaced-assignment":
    dollarVariableNoNamespacedAssignment,
  "dollar-variable-pattern": dollarVariablePattern,
  "double-slash-comment-empty-line-before": doubleSlashCommentEmptyLineBefore,
  "double-slash-comment-inline": doubleSlashCommentInline,
  "double-slash-comment-whitespace-inside": doubleSlashCommentWhitespaceInside,
  "function-disallowed-list": functionDisallowedList,
  "function-calculation-no-interpolation": functionCalculationNoInterpolation,
  "function-color-channel": functionColorChannel,
  "function-color-relative": functionColorRelative,
  "function-no-unknown": functionNoUnknown,
  "function-quote-no-quoted-strings-inside": functionQuoteNoQuotedStringsInside,
  "function-unquote-no-unquoted-strings-inside":
    functionUnquoteNoUnquotedStringsInside,
  "map-keys-quotes": mapKeysQuotes,
  "media-feature-value-dollar-variable": mediaFeatureValueDollarVariable,
  "no-dollar-variables": noDollarVariables,
  "no-duplicate-dollar-variables": noDuplicateDollarVariables,
  "no-duplicate-load-rules": noDuplicateLoadRules,
  "no-duplicate-mixins": noDuplicateMixins,
  "no-global-function-names": noGlobalFunctionNames,
  "no-unused-private-members": noUnusedPrivateMembers,
  "operator-no-newline-after": operatorNoNewlineAfter,
  "operator-no-newline-before": operatorNoNewlineBefore,
  "operator-no-unspaced": operatorNoUnspaced,
  "partial-no-import": partialNoImport,
  "percent-placeholder-pattern": percentPlaceholderPattern,
  "property-no-unknown": propertyNoUnknown,
  "selector-class-pattern": selectorClassPattern,
  "selector-nest-combinators": selectorNestCombinators,
  "selector-no-redundant-nesting-selector": selectorNoRedundantNestingSelector,
  "selector-no-union-class-name": selectorNoUnionClassName
};

export default rules;
