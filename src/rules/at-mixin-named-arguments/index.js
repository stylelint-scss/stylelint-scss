import { utils } from "stylelint";
import { namespace, optionsHaveIgnored, ruleUrl } from "../../utils";

export const ruleName = namespace("at-mixin-named-arguments");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected a named parameter to be used in at-include call",
  rejected: "Unexpected a named parameter in at-include call"
});

export const meta = {
  url: ruleUrl(ruleName)
};

const hasArgumentsRegExp = /\((.*)\)$/;
const isScssVarRegExp = /^\$\S*/;

export default function rule(expectation, options) {
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

    root.walkAtRules("include", atRule => {
      const argsString = atRule.params
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
          argsString.split(":").map(argsKeyValuePair => argsKeyValuePair.trim())
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
              node: atRule,
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
              node: atRule,
              result,
              ruleName
            });
            break;
          }
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
