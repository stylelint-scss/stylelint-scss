import { utils } from "stylelint"

export const ruleName = "at-import-no-partial-leading-underscore"

export const messages = utils.ruleMessages(ruleName, {
  expected: "Unexpected leading underscore in imported partial name",
})

export default function (actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    function checkPathForUnderscore(path, decl) {
      // Stripping trailing quotes and whitespaces, if any
      const pathStripped = path.replace(/^\s*?("|')\s*?/, "").replace(/\s*?("|')\s*?$/, "")

      // Skipping importing CSS: url(), ".css", URI with a protocol, media
      if (pathStripped.slice(0, 4) === "url(" ||
        pathStripped.slice(-4) === ".css" ||
        pathStripped.search("//") !== -1 ||
        pathStripped.search(/(?:\s|[,)"'])\w+$/) !== -1
      ) {
        return
      }
      // Searching a _ at the start of filename
      if (pathStripped.search(/(?:^|\/|\\)_[^/]+$/) === -1) { return }

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
