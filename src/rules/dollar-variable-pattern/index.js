import { isRegExp, isString } from "lodash"
import { utils } from "stylelint"

export const ruleName = "dollar-variable-pattern"

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected $ variable name to match specified pattern",
})

export default function (pattern) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ],
    })
    if (!validOptions) { return }

    const regexpPattern = (isString(pattern))
      ? new RegExp(pattern)
      : pattern

    root.walkDecls(decl => {
      const { prop } = decl
      if (prop[0] !== "$") { return }
      if (regexpPattern.test(prop.slice(1))) { return }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
