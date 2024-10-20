import valueParser from "postcss-value-parser";
import stylelint from "stylelint";
import declarationValueIndex from "../../utils/declarationValueIndex.js";
import isNativeCssFunction from "../../utils/isNativeCssFunction.js";
import { isString } from "../../utils/validateTypes.js";
import namespace from "../../utils/namespace.js";
import optionsHaveIgnored from "../../utils/optionsHaveIgnored.js";
import { parseFunctionArguments } from "../../utils/parseFunctionArguments.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

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
      const declValueIndex = declarationValueIndex(decl);

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
            const interpolationRegex = /^#{/;
            const funcName = node.value.replace(interpolationRegex, "");
            const isRegex = /^\/.*\//.test(f);

            if (!isRegex) {
              return f === funcName;
            }

            const parts = f.split("/");

            return new RegExp(parts[1], parts[2] || "").test(funcName);
          });

        if (hasFuncIgnored) {
          return;
        }

        const args = parseFunctionArguments(valueParser.stringify(node));
        const isSingleArgument = args.length === 1;

        if (isSingleArgument && shouldIgnoreSingleArgument) {
          return;
        }

        const baseIndex = declValueIndex + node.sourceIndex;

        args.forEach(({ key, index, endIndex }) => {
          switch (expectation) {
            case "never": {
              if (!key) {
                return;
              }

              utils.report({
                message: messages.rejected,
                node: decl,
                result,
                ruleName,
                index: baseIndex + index,
                endIndex: baseIndex + endIndex
              });
              break;
            }

            case "always": {
              if (key && isScssVarRegExp.test(key)) {
                return;
              }

              utils.report({
                message: messages.expected,
                node: decl,
                result,
                ruleName,
                index: baseIndex + index,
                endIndex: baseIndex + endIndex
              });
              break;
            }
          }
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
