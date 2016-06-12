import { utils } from "stylelint"
import { namespace } from "../../utils"

export const ruleName = namespace("media-query-value-dollar-variable")

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected dollar-variable as a value in a media query",
  expected: "Expected a dollar-variable (e.g. $var) to be used as a value in a media query",
})

export default function (expectation, options) {
  return function (root, result) {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never" ],
    }, {
      actual: options,
      optional: true,
      possible: {
        ignore: [ "calculations", "funcitons" ],
      },
    })
    if (!validOptions) { return }

    // In `(max-witdh: 10px )` find `: 10px )`
    const valueRegex = /:(?:\s*?)(\S.+?)(:?\s*?)\)/
    const valueRegexGlobal = new RegExp(valueRegex.source, "g")

    root.walkAtRules("media", atRule => {
      const found = atRule.params.match(valueRegexGlobal)
      if (!found || !found.length) { return }
      found.forEach(function (found) {
        // ... parse it to "10px"
        const valueParsed = found.match(valueRegex)[1]

        // A value should be a single variable without any appendices (math operations)
        // or it should be a single variable inside Sass interpolation
        if (expectation === "always" && !(valueParsed[0] === "$" &&
          valueParsed.search(/(\s|[+-/*])/) === -1 ||
          valueParsed.search(/^#\{\s*?\$[A-Za-z_0-9]+\s*?\}$/) !== -1
        )) {
          utils.report({
            ruleName,
            result,
            node: atRule,
            word: valueParsed,
            message: messages.expected,
          })
        } else if (expectation === "never" && valueParsed.search(/\$/) !== -1) {
          // "Never" means no variables at all (functions allowed)
          utils.report({
            ruleName,
            result,
            node: atRule,
            word: valueParsed,
            message: messages.rejected,
          })
        }
      })
    })
  }
}
