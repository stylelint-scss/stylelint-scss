import { utils } from "stylelint"

export const ruleName = "test-rule"

export const messages = utils.ruleMessages(ruleName, {
  rejected: (p) => `Property ${p} not allowed`,
})

export default function (actual) {
  return function (root, result) {
    const validOptions = utils.validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkRules(rule => {

      rule.walkDecls(decl => {
        if (/^font/.test(decl.prop)) {
          utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.rejected(decl.prop),
          })
        }
      })
    })
  }
}
