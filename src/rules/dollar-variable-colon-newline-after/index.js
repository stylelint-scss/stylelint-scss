import {
  declarationValueIndex,
  namespace,
  whitespaceChecker,
} from "../../utils"
import { utils } from "stylelint"

export const ruleName = namespace("dollar-variable-colon-newline-after")

export const messages = utils.ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \":\"",
  expectedAfterMultiLine: () => "Expected newline after \":\" with a multi-line value",
})

export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-multi-line",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (!decl.prop || decl.prop[0] !== "$") { return }

      // Get the raw $var, and only that
      const endOfPropIndex = declarationValueIndex(decl) + decl.raw("between").length - 1
      // `$var:`, `$var :`
      const propPlusColon = decl.toString().slice(0, endOfPropIndex)

      for (let i = 0, l = propPlusColon.length; i < l; i++) {
        if (propPlusColon[i] !== ":") { continue }
        const indexToCheck = (propPlusColon.substr(propPlusColon[i], 3) === "/*")
          ? propPlusColon.indexOf("*/", i) + 1
          : i

        checker.afterOneOnly({
          source: propPlusColon,
          index: indexToCheck,
          lineCheckStr: decl.value,
          err: m => {
            utils.report({
              message: m,
              node: decl,
              index: indexToCheck,
              result,
              ruleName,
            })
          },
        })
        break
      }
    })
  }
}
