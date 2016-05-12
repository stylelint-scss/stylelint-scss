import { isBoolean } from "lodash"
import { utils } from "stylelint"

export const ruleName = "at-mixin-no-argumentless-call-parentheses"

export const messages = utils.ruleMessages(ruleName, {
  expected: "Unexpected parentheses in argumentless @mixin call",
})

export default function (value) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value,
      possible: isBoolean,
    })
    if (!validOptions) { return }

    root.walkAtRules("include", decl => {
      if (decl.params.search(/\(\s*?\)\s*?$/) === -1) { return }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
