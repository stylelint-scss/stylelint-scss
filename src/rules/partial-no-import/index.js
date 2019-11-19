"use strict";

const nodeJsPath = require("path");
const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("partial-no-import");

const messages = utils.ruleMessages(ruleName, {
  expected: "Unexpected @import in a partial"
});

function rule(on) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: on
    });

    if (!validOptions) {
      return;
    }

    if (root.source.input.file === undefined || !root.source.input.file) {
      result.warn(
        "The 'partial-no-import' rule won't work if linting in a code string without an actual file."
      );

      return;
    }

    const fileName = nodeJsPath.basename(root.source.input.file);
    const extName = nodeJsPath.extname(root.source.input.file);

    function checkImportForCSS(path, decl) {
      // Stripping trailing quotes and whitespaces, if any
      const pathStripped = path
        .replace(/^\s*?("|')\s*/, "")
        .replace(/\s*("|')\s*?$/, "");

      // Skipping importing empty import, CSS: url(), ".css", URI with a protocol, media
      if (
        pathStripped.trim() === "" ||
        pathStripped.slice(0, 4) === "url(" ||
        pathStripped.slice(-4) === ".css" ||
        pathStripped.search("//") !== -1 ||
        pathStripped.search(/(?:\s|[,)"'])\w+$/) !== -1
      ) {
        return;
      }

      utils.report({
        message: messages.expected,
        node: decl,
        index: decl.params.indexOf(path),
        result,
        ruleName
      });
    }

    // Usual CSS file
    if (extName === ".css") {
      return;
    }

    // Not a partial
    if (fileName[0] !== "_") {
      return;
    }

    root.walkAtRules("import", mixinCall => {
      // Check if @import is treated as CSS import; report only if not
      // Processing comma-separated lists of import paths
      mixinCall.params.split(/["']\s*,/).forEach(path => {
        checkImportForCSS(path, mixinCall);
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
