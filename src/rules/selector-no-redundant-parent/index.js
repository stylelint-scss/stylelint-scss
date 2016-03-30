import { utils } from "stylelint"

export const ruleName = "selector-no-redundant-parent"

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unnecessary parent selector (&)",
})

export default function (actual) {
  return function (root, result) {
    const validOptions = utils.validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {
      const unnecessaryAmpersandRegex = /^&(\s+)?>?(\s+)?(\w+|\s\.)/

      if (rule.selector.trim() === "&" || unnecessaryAmpersandRegex.test(rule.selector.trim())) {
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
