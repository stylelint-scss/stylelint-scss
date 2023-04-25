"use strict";

const nodeJsPath = require("path");
const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("at-import-partial-extension");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected @import to have an extension",
  rejected: ext => `Unexpected extension ".${ext}" in @import`
});

const meta = {
  url: ruleUrl(ruleName)
};

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
  path.replace(/^\s*(["'])\s*/, "").replace(/\s*(["'])\s*$/, "");

function rule(expectation, _, context) {
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
        .split(/["']\s*,/)
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

        const isScssPartial = extension === "scss";
        if (extension && isScssPartial && expectation === "never") {
          if (context.fix) {
            const extPattern = new RegExp(`\\.${extension}(['" ]*)$`, "g");
            decl.params = decl.params.replace(extPattern, "$1");

            return;
          }

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

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
