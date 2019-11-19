"use strict";

const nodeJsPath = require("path");
const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-import-partial-extension");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected @import to have an extension",
  rejected: ext => `Unexpected extension ".${ext}" in @import`
});

// https://drafts.csswg.org/mediaqueries/#media-types
const mediaQueryTypes = [
  "all",
  "print",
  "screen",
  "speech",
  "tv",
  "tty",
  "projection",
  "handheld",
  "braille",
  "embossed",
  "aural"
];

const mediaQueryTypesRE = new RegExp(`(${mediaQueryTypes.join("|")})$`, "i");
const stripPath = path =>
  path.replace(/^\s*?("|')\s*/, "").replace(/\s*("|')\s*?$/, "");

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("import", decl => {
      const paths = decl.params
        .split(",")
        .filter(path => !mediaQueryTypesRE.test(path.trim()));

      // Processing comma-separated lists of import paths
      paths.forEach(path => {
        // Stripping trailing quotes and whitespaces, if any
        const pathStripped = stripPath(path);

        // Skipping importing CSS: url(), ".css", URI with a protocol
        if (
          pathStripped.slice(0, 4) === "url(" ||
          pathStripped.slice(-4) === ".css" ||
          pathStripped.search("//") !== -1
        ) {
          return;
        }

        const extension = nodeJsPath.extname(pathStripped).slice(1);

        if (!extension && expectation === "always") {
          utils.report({
            message: messages.expected,
            node: decl,
            result,
            ruleName
          });

          return;
        }

        if (extension && expectation === "never") {
          utils.report({
            message: messages.rejected(extension),
            node: decl,
            word: extension,
            result,
            ruleName
          });
        }
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
