import { rules } from "stylelint"
import { namespace } from "../../utils"

export const ruleName = namespace("at-rule-no-unknown")

// export const messages = utils.ruleMessages(ruleName, {
  // rejected: (atRule) => `Unexpected unknown at-rule "${atRule}"`,
// })

const sassAtRules = [
  "extend", "at-root", "debug",
  "warn", "error", "if", "else",
  "for", "each", "while", "mixin",
  "include", "content", "return", "function",
]

export default function (on, options) {
  return (root, result) => {
    const defaultedOptions = Object.assign({}, options, {
      ignoreAtRules: sassAtRules.concat(options && options.ignoreAtRules || []),
    })

    rules["at-rule-no-unknown"](on, defaultedOptions)(root, result)
  }
}
