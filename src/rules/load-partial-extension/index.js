import * as nodeJsPath from "node:path";
import atRuleParamIndex from "../../utils/atRuleParamIndex.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

const { utils } = stylelint;

const ruleName = namespace("load-partial-extension");

const messages = utils.ruleMessages(ruleName, {
  expected: (atRuleName = "import") =>
    `Expected @${atRuleName} to have an extension`,
  rejected: (ext, atRuleName = "import") =>
    `Unexpected extension ".${ext}" in @${atRuleName}`
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
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

const mediaQueryTypesRE = new RegExp(`(?:${mediaQueryTypes.join("|")})$`, "i");
const hasArgumentsRegExp = /\([^)]+\)/;
const loadAtRules = ["import", "use", "forward", "include"];
const stripPath = path =>
  path.replace(/^\s*(["'])\s*/, "").replace(/\s*(["'])\s*$/, "");

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atRule => {
      if (loadAtRules.includes(atRule.name)) {
        let name = atRule.name;
        let paths = atRule.params
          .split(/["']\s*,/)
          .filter(path => !mediaQueryTypesRE.test(path.trim()));

        const isLoadCss = Boolean(atRule.params.match(/load-css/));

        if (isLoadCss) {
          name = "meta.load-css";
          paths = [
            hasArgumentsRegExp
              .exec(atRule.params)[0]
              .split(",")[0]
              .replace(/[()]/g, "")
          ];
        } else if (atRule.name === "include") {
          return;
        }

        // Processing comma-separated lists of import paths
        paths.forEach(pathItem => {
          // Stripping trailing quotes and whitespaces, if any
          const pathStripped = stripPath(pathItem);

          // Skipping importing CSS: url(), ".css", URI with a protocol
          if (
            pathStripped.slice(0, 4) === "url(" ||
            pathStripped.slice(-4) === ".css" ||
            pathStripped.search("//") !== -1 ||
            pathStripped.search(":") !== -1
          ) {
            return;
          }

          const extension = nodeJsPath.extname(pathStripped).slice(1);

          if (!extension && expectation === "always") {
            utils.report({
              message: messages.expected(name),
              node: atRule,
              result,
              ruleName,
              word: pathStripped
            });

            return;
          }

          const isScssPartial = extension === "scss";

          if (extension && isScssPartial && expectation === "never") {
            const fix = () => {
              const extPattern = new RegExp(`\\.${extension}(['" ]*)$`, "g");

              if (isLoadCss) {
                atRule.params = atRule.params.replace(
                  pathItem,
                  pathItem.replace(extPattern, "$1")
                );
              }

              atRule.params = atRule.params.replace(extPattern, "$1");
            };

            const dotExt = `.${extension}`;
            const index =
              atRuleParamIndex(atRule) + atRule.params.lastIndexOf(dotExt);

            utils.report({
              message: messages.rejected(extension, name),
              node: atRule,
              index,
              endIndex: index + dotExt.length,
              result,
              ruleName,
              fix
            });
          }
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
