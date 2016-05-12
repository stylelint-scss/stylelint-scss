import { utils } from "stylelint"

export const ruleName = "at-extend-no-missing-placeholder"

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Expected a placeholder selector (e.g. %placeholder) to be used in @extend",
})

export default function (actual) {
  return function (root, result) {
    const validOptions = utils.validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkAtRules("extend", atrule => {
      const isPlaceholder = atrule.params.trim()[0] === "%"
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
