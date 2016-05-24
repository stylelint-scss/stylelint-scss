import { isRegExp, isString } from "lodash"
import { utils } from "stylelint"
import nodeJsPath from "path"

export const ruleName = "at-import-no-partial-extension"

export const messages = utils.ruleMessages(ruleName, {
  expected: "Unexpected file extension in imported partial name",
})

export default function (on, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: on,
    }, {
      actual: options,
      possible: {
        // Accepting array of either strings or regular expressions
        ignoreExtensions: str => isRegExp(str) || isString(str),
      },
      optional: true,
    })
    if (!validOptions) { return }

    function checkPathForUnderscore(path, decl) {
      // Stripping trailing quotes and whitespaces, if any
      const pathStripped = path.replace(/^\s*?("|')\s*/, "").replace(/\s*("|')\s*?$/, "")
      const extension = nodeJsPath.extname(pathStripped).slice(1)

      // Skipping importing CSS: url(), ".css", URI with a protocol, media
      if (pathStripped.slice(0, 4) === "url(" ||
        pathStripped.slice(-4) === ".css" ||
        pathStripped.search("//") !== -1 ||
        pathStripped.search(/(?:\s|[,)"'])\w+$/) !== -1
      ) {
        return
      }
      // If the extension is not empty
      if (!extension) { return }
      
      if (options && options.ignoreExtensions) {
        // Return if...
        if (options.ignoreExtensions.some(ignoredExt => {
          // the extension matches on of the ignored strings or Regexps
          return isString(ignoredExt) && ignoredExt === extension ||
            isRegExp(ignoredExt) && extension.search(ignoredExt) !== -1
        })) { return }
      }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
      })
    }

    root.walkAtRules("import", decl => {
      // Processing comma-separated lists of import paths
      decl.params.split(",").forEach(path => {
        checkPathForUnderscore(path, decl)
      })
    })
  }
}
