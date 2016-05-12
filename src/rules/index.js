import atExtendNoMissingPlaceholder from "./at-extend-no-missing-placeholder"
import atFunctionPattern from "./at-function-pattern"
import atMixinNoArgumentlessCallParentheses from "./at-mixin-no-argumentless-call-parentheses"
import atMixinPattern from "./at-mixin-pattern"
import dollarVariableNoMissingInterpolation from "./dollar-variable-no-missing-interpolation"
import dollarVariablePattern from "./dollar-variable-pattern"
import selectorNoRedundantNestingSelector from "./selector-no-redundant-nesting-selector"

export default {
  "at-extend-no-missing-placeholder": atExtendNoMissingPlaceholder,
  "at-function-pattern": atFunctionPattern,
  "at-mixin-no-argumentless-call-parentheses": atMixinNoArgumentlessCallParentheses,
  "at-mixin-pattern": atMixinPattern,
  "dollar-variable-no-missing-interpolation": dollarVariableNoMissingInterpolation,
  "dollar-variable-pattern": dollarVariablePattern,
  "selector-no-redundant-nesting-selector": selectorNoRedundantNestingSelector,
}