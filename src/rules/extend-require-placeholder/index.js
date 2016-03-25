import { utils } from "stylelint"

export const ruleName = "extend-require-placeholder"

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Use a placeholder selector (e.g. %some-placeholder) with @extend",
})

export default function (actual) {
  return function (root, result) {
    const validOptions = utils.validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkAtRules("extend", atrule => {
      const isPlaceholder = (/^%/).test(atrule.params.trim())
      const isInterpolation = (/^#{.+}/).test(atrule.params.trim())

      if (!isPlaceholder && !isInterpolation) {
        utils.report({
          ruleName,
          result,
          node: atrule,
          message: messages.rejected,
        })
      }
    })
  }
}
