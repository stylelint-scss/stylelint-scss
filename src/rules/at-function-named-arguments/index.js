import { utils } from "stylelint";
import { namespace, optionsHaveIgnored } from "../../utils";
import valueParser from "postcss-value-parser";

export const ruleName = namespace("at-function-named-arguments");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected a named parameter to be used in function call",
  rejected: "Unexpected a named parameter in function call",
  rejectedSingle:
    "Unexpected a named parameter in single argument function call"
});

const cssFunctions = [
  "attr",
  "calc",
  "linear-gradient",
  "radial-gradient",
  "repeating-linear-gradient",
  "repeating-radial-gradient"
];

const hasArgumentsRegExp = /\((.*)\)$/;
const isScssVarRegExp = /^\$\S*/;

export default function(expectation, options) {
  return function(root, result) {
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
          ignore: ["single-argument"]
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
          cssFunctions.indexOf(node.value.toLowerCase()) !== -1
        ) {
          return;
        }

        const argsString = decl.value
          .replace(/\n/g, " ")
          .match(hasArgumentsRegExp);

        // Ignore @include that does not contain arguments.
        if (
          !argsString ||
          argsString.index === -1 ||
          argsString[0].length === 2
        ) {
          return;
        }

        const args = argsString[1]
          // Create array of arguments.
          .split(",")
          // Create a key-value array for every argument.
          .map(argsString =>
            argsString
              .split(":")
              .map(argsKeyValuePair => argsKeyValuePair.trim())
          )
          .reduce((resultArray, keyValuePair) => {
            const pair = { value: keyValuePair[1] || keyValuePair[0] };

            if (keyValuePair[1]) {
              pair.key = keyValuePair[0];
            }

            return [...resultArray, pair];
          }, []);

        const isSingleArgument = args.length === 1;

        if (isSingleArgument && shouldIgnoreSingleArgument) {
          return;
        }

        args.forEach(arg => {
          switch (expectation) {
            case "never": {
              if (!arg.key) {
                return;
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
                return;
              }

              utils.report({
                message: messages.expected,
                node: decl,
                result,
                ruleName
              });
              break;
            }
          }
        });
      });
    });
  };
}
