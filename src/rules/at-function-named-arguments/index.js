"use strict";

const valueParser = require("postcss-value-parser");
const { utils } = require("stylelint");
const isNativeCssFunction = require("../../utils/isNativeCssFunction.js");
const { isString } = require("../../utils/validateTypes.js");
const namespace = require("../../utils/namespace.js");
const optionsHaveIgnored = require("../../utils/optionsHaveIgnored.js");
const {
  parseFunctionArguments
} = require("../../utils/parseFunctionArguments.js");
const ruleUrl = require("../../utils/ruleUrl.js");

const ruleName = namespace("at-function-named-arguments");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected a named parameter to be used in function call",
  rejected: "Unexpected a named parameter in function call"
});

const meta = {
  url: ruleUrl(ruleName)
};

const isScssVarRegExp = /^\$\S*/;

function rule(expectation, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["always", "never"]
      },
      {
        actual: options,
        possible: {
          ignore: ["single-argument"],
          ignoreFunctions: [isString]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const shouldIgnoreSingleArgument = optionsHaveIgnored(
      options,
      "single-argument"
    );

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        if (
          node.type !== "function" ||
          isNativeCssFunction(node.value) ||
          node.value === ""
        ) {
          return;
        }

        const hasFuncIgnored =
          options &&
          options.ignoreFunctions &&
          options.ignoreFunctions.some(f => {
            const isRegex = /^\/.*\//.test(f);

            if (!isRegex) {
              return f === node.value;
            }

            const parts = f.split("/");

            return new RegExp(parts[1], parts[2] || "").test(node.value);
          });

        if (hasFuncIgnored) {
          return;
        }

        const args = parseFunctionArguments(valueParser.stringify(node));
        const isSingleArgument = args.length === 1;

        if (isSingleArgument && shouldIgnoreSingleArgument) {
          return;
        }

        for (const arg of args) {
          switch (expectation) {
            case "never": {
              if (!arg.key) {
                continue;
              }

              utils.report({
                message: messages.rejected,
                node: decl,
                result,
                ruleName
              });
              break;
            }

            case "always": {
              if (arg.key && isScssVarRegExp.test(arg.key)) {
                continue;
              }

              utils.report({
                message: messages.expected,
                node: decl,
                result,
                ruleName
              });
              break;
            }

            default:
            // nothing
          }
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
