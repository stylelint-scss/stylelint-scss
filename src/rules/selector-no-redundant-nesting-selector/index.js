import { utils } from "stylelint"

export const ruleName = "selector-no-redundant-nesting-selector"

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unnecessary nesting selector (&)",
})

export default function (actual) {
  return function (root, result) {
    const validOptions = utils.validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(/&/, rule => {
      const { selector } = rule
      const combinatorRegex = /^&\s*(>|\+|~)\s*\.*[a-zA-Z]+/
      const classOrElementRegex = /^&\s+\.*[a-zA-Z]+/

      if (selector === "&" || classOrElementRegex.test(selector) || combinatorRegex.test(selector)) {
        utils.report({
          ruleName,
          result,
          node: rule,
          message: messages.rejected,
        })
      }
    })
  }
}
