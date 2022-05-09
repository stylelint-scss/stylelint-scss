import { isRegExp, isString } from "lodash";
import { utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";
import nodeJsPath from "path";

export const ruleName = namespace("at-import-partial-extension-whitelist");

export const messages = utils.ruleMessages(ruleName, {
  rejected: ext => `Unexpected extension ".${ext}" in imported partial name`
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(whitelistOption) {
  const whitelist = [].concat(whitelistOption);

  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: whitelistOption,
      possible: [isString, isRegExp]
    });

    if (!validOptions) {
      return;
    }

    function checkPathForUnderscore(path, decl) {
      // Stripping trailing quotes and whitespaces, if any
      const pathStripped = path
        .replace(/^\s*(["'])\s*/, "")
        .replace(/\s*(["'])\s*$/, "");
      const extension = nodeJsPath.extname(pathStripped).slice(1);
      // Save this separately to be able to pass the original string to report()
      const extensionNormalized = extension.toLowerCase();

      // If the extension is empty
      if (!extension) {
        return;
      }

      // Skipping importing CSS: url(), ".css", URI with a protocol, media
      if (
        pathStripped.slice(0, 4) === "url(" ||
        pathStripped.slice(-4) === ".css" ||
        pathStripped.search("//") !== -1 ||
        pathStripped.search(/[\s,)"']\w+$/) !== -1
      ) {
        return;
      }

      if (
        whitelist.some(ext => {
          return (
            (isString(ext) && extensionNormalized === ext) ||
            (isRegExp(ext) && extensionNormalized.search(ext) !== -1)
          );
        })
      ) {
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

    root.walkAtRules("import", atRule => {
      // Processing comma-separated lists of import paths
      atRule.params.split(",").forEach(path => {
        checkPathForUnderscore(path, atRule);
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
