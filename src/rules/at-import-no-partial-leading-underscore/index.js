"use strict";

const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-import-no-partial-leading-underscore");

const messages = utils.ruleMessages(ruleName, {
  expected: "Unexpected leading underscore in imported partial name"
});

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    function checkPathForUnderscore(path, decl) {
      // Stripping trailing quotes and whitespaces, if any
      const pathStripped = path
        .replace(/^\s*?("|')\s*/, "")
        .replace(/\s*("|')\s*?$/, "");

      // Searching a _ at the start of filename
      if (pathStripped.search(/(?:^|\/|\\)_[^/]+$/) === -1) {
        return;
      }

      // Skipping importing CSS: url(), ".css", URI with a protocol, media
      if (
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
        result,
        ruleName
      });
    }

    root.walkAtRules("import", decl => {
      // Processing comma-separated lists of import paths
      decl.params.split(",").forEach(path => {
        checkPathForUnderscore(path, decl);
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
