import { utils } from "stylelint"
import { namespace } from "../../utils"

export const ruleName = namespace("at-mixin-no-argumentless-call-parentheses")

export const messages = utils.ruleMessages(ruleName, {
  expected: "Unexpected parentheses in argumentless @mixin call",
})

export default function (value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value,
      possible: [ "always", "never" ],
    })
    if (!validOptions) { return }

    root.walkAtRules("include", mixinCall => {
      // If is is "No parens in argumentless calls"
      if (value === "never" && mixinCall.params.search(/\(\s*?\)\s*?$/) === -1) { return }
      // If is is "Always use parens"
      if (value === "always" && mixinCall.params.search(/\(/) !== -1) { return }

      utils.report({
        message: messages.expected,
        node: mixinCall,
        result,
        ruleName,
      })
    })
  }
}
