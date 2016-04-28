import { isRegExp, isString } from "lodash"
import { utils } from "stylelint"

export const ruleName = "scss-function-pattern"

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected SCSS function name to match specified pattern",
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

    root.walkAtRules(declaration => {
      const decl = declaration
      if (declaration.name !== "function") { return }
      // Stripping the function of its arguments
      if (regexpPattern.test(declaration.params.replace(/(\s*?)\(.*?\)/g, ""))) { return }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
      })
    })
  }
}
