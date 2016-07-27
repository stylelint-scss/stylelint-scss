import atExtendNoMissingPlaceholder from "./at-extend-no-missing-placeholder"
import atFunctionPattern from "./at-function-pattern"
import atImportNoPartialExtension from "./at-import-no-partial-extension"
import atImportNoPartialLeadingUnderscore from "./at-import-no-partial-leading-underscore"
import atImportPartialExtensionBlacklist from "./at-import-partial-extension-blacklist"
import atImportPartialExtensionWhitelist from "./at-import-partial-extension-whitelist"
import atMixinArgumentlessCallParentheses from "./at-mixin-argumentless-call-parentheses"
import atMixinNoArgumentlessCallParentheses from "./at-mixin-no-argumentless-call-parentheses"
import atMixinPattern from "./at-mixin-pattern"
import declarationNestedProperties from "./declaration-nested-properties"
import dollarVariableColonNewlineAfter from "./dollar-variable-colon-newline-after"
import dollarVariableColonSpaceAfter from "./dollar-variable-colon-space-after"
import dollarVariableColonSpaceBefore from "./dollar-variable-colon-space-before"
import dollarVariableNoMissingInterpolation from "./dollar-variable-no-missing-interpolation"
import dollarVariablePattern from "./dollar-variable-pattern"
import doubleSlashCommentEmptyLineBefore from "./double-slash-comment-empty-line-before"
import doubleSlashCommentInline from "./double-slash-comment-inline"
import doubleSlashCommentWhitespaceInside from "./double-slash-comment-whitespace-inside"
import mediaFeatureValueDollarVariable from "./media-feature-value-dollar-variable"
import operatorNoNewlineAfter from "./operator-no-newline-after"
import operatorNoNewlineBefore from "./operator-no-newline-before"
import operatorNoUnspaced from "./operator-no-unspaced"
import partialNoImport from "./partial-no-import"
import percentPlaceholderPattern from "./percent-placeholder-pattern"
import selectorNoRedundantNestingSelector from "./selector-no-redundant-nesting-selector"

export default {
  "at-extend-no-missing-placeholder": atExtendNoMissingPlaceholder,
  "at-function-pattern": atFunctionPattern,
  "at-import-no-partial-extension": atImportNoPartialExtension,
  "at-import-no-partial-leading-underscore": atImportNoPartialLeadingUnderscore,
  "at-import-partial-extension-blacklist": atImportPartialExtensionBlacklist,
  "at-import-partial-extension-whitelist": atImportPartialExtensionWhitelist,
  "at-mixin-argumentless-call-parentheses": atMixinArgumentlessCallParentheses,
  "at-mixin-no-argumentless-call-parentheses": atMixinNoArgumentlessCallParentheses,
  "at-mixin-pattern": atMixinPattern,
  "declaration-nested-properties": declarationNestedProperties,
  "dollar-variable-colon-newline-after": dollarVariableColonNewlineAfter,
  "dollar-variable-colon-space-after": dollarVariableColonSpaceAfter,
  "dollar-variable-colon-space-before": dollarVariableColonSpaceBefore,
  "dollar-variable-no-missing-interpolation": dollarVariableNoMissingInterpolation,
  "dollar-variable-pattern": dollarVariablePattern,
  "double-slash-comment-empty-line-before": doubleSlashCommentEmptyLineBefore,
  "double-slash-comment-inline": doubleSlashCommentInline,
  "double-slash-comment-whitespace-inside": doubleSlashCommentWhitespaceInside,
  "media-feature-value-dollar-variable": mediaFeatureValueDollarVariable,
  "operator-no-newline-after": operatorNoNewlineAfter,
  "operator-no-newline-before": operatorNoNewlineBefore,
  "operator-no-unspaced": operatorNoUnspaced,
  "percent-placeholder-pattern": percentPlaceholderPattern,
  "partial-no-import": partialNoImport,
  "selector-no-redundant-nesting-selector": selectorNoRedundantNestingSelector,
}