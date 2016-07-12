import atExtendNoMissingPlaceholder from "./at-extend-no-missing-placeholder"
import atFunctionPattern from "./at-function-pattern"
import atImportNoPartialExtension from "./at-import-no-partial-extension"
import atImportNoPartialLeadingUnderscore from "./at-import-no-partial-leading-underscore"
import atImportPartialExtensionBlacklist from "./at-import-partial-extension-blacklist"
import atImportPartialExtensionWhitelist from "./at-import-partial-extension-whitelist"
import atMixinArgumentlessCallParentheses from "./at-mixin-argumentless-call-parentheses"
import atMixinNoArgumentlessCallParentheses from "./at-mixin-no-argumentless-call-parentheses"
import atMixinPattern from "./at-mixin-pattern"
import dollarVariableColonSpaceAfter from "./dollar-variable-colon-space-after"
import dollarVariableNoMissingInterpolation from "./dollar-variable-no-missing-interpolation"
import dollarVariablePattern from "./dollar-variable-pattern"
import mediaFeatureValueDollarVariable from "./media-feature-value-dollar-variable"
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
  "dollar-variable-colon-space-after": dollarVariableColonSpaceAfter,
  "dollar-variable-no-missing-interpolation": dollarVariableNoMissingInterpolation,
  "dollar-variable-pattern": dollarVariablePattern,
  "media-feature-value-dollar-variable": mediaFeatureValueDollarVariable,
  "percent-placeholder-pattern": percentPlaceholderPattern,
  "partial-no-import": partialNoImport,
  "selector-no-redundant-nesting-selector": selectorNoRedundantNestingSelector,
}