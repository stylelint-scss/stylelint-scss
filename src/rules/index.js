import atExtendNoMissingPlaceholder from "./at-extend-no-missing-placeholder"
import atFunctionPattern from "./at-function-pattern"
import atImportNoPartialExtension from "./at-import-no-partial-extension"
import atImportNoPartialLeadingUnderscore from "./at-import-no-partial-leading-underscore"
import atMixinNoArgumentlessCallParentheses from "./at-mixin-no-argumentless-call-parentheses"
import atMixinPattern from "./at-mixin-pattern"
import dollarVariableNoMissingInterpolation from "./dollar-variable-no-missing-interpolation"
import dollarVariablePattern from "./dollar-variable-pattern"
import mediaQueryValueDollarVariable from "./media-query-value-dollar-variable"
import partialNoImport from "./partial-no-import"
import percentPlaceholderPattern from "./percent-placeholder-pattern"
import selectorNoRedundantNestingSelector from "./selector-no-redundant-nesting-selector"

export default {
  "at-extend-no-missing-placeholder": atExtendNoMissingPlaceholder,
  "at-function-pattern": atFunctionPattern,
  "at-import-no-partial-extension": atImportNoPartialExtension,
  "at-import-no-partial-leading-underscore": atImportNoPartialLeadingUnderscore,
  "at-mixin-no-argumentless-call-parentheses": atMixinNoArgumentlessCallParentheses,
  "at-mixin-pattern": atMixinPattern,
  "dollar-variable-no-missing-interpolation": dollarVariableNoMissingInterpolation,
  "dollar-variable-pattern": dollarVariablePattern,
  "media-query-value-dollar-variable": mediaQueryValueDollarVariable,
  "percent-placeholder-pattern": percentPlaceholderPattern,
  "partial-no-import": partialNoImport,
  "selector-no-redundant-nesting-selector": selectorNoRedundantNestingSelector,
}