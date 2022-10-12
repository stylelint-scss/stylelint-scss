import { isRegExp, isString } from "lodash";
import { rules, utils } from "stylelint";
import valueParser from "postcss-value-parser";
import { namespace, ruleUrl, ALL_FUNCTIONS } from "../../utils";

const ruleToCheckAgainst = "function-no-unknown";

export const ruleName = namespace(ruleToCheckAgainst);

export const messages = utils.ruleMessages(ruleName, {
  rejected: (...args) => {
    return rules[ruleToCheckAgainst].messages
      .rejected(...args)
      .replace(` (${ruleToCheckAgainst})`, "");
  },
});

export const meta = {
  url: ruleUrl(ruleName),
};

export default function rule(primaryOption, secondaryOptions) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption,
      },
      {
        actual: secondaryOptions,
        possible: {
          ignoreFunctions: [isString, isRegExp],
        },
        optional: true,
      }
    );

    if (!validOptions) {
      return;
    }

    const optionsFunctions =
      (secondaryOptions && secondaryOptions.ignoreFunctions) || [];
    const ignoreFunctions = ALL_FUNCTIONS.concat(optionsFunctions);
    const ignoreFunctionsAsSet = new Set(ignoreFunctions);
    const newSecondaryOptions = Object.assign({}, secondaryOptions, {
      ignoreFunctions,
    });

    utils.checkAgainstRule(
      {
        ruleName: ruleToCheckAgainst,
        ruleSettings: [primaryOption, newSecondaryOptions],
        root,
      },
      (warning) => {
        const { node, index } = warning;

        // NOTE: Using `valueParser` is necessary for extracting a function name. This may be a performance waste.
        valueParser(node.value).walk((valueNode) => {
          const { type, value: funcName } = valueNode;

          if (type !== "function") {
            return;
          }

          if (!ignoreFunctionsAsSet.has(funcName)) {
            utils.report({
              message: messages.rejected(funcName),
              ruleName,
              result,
              node,
              index,
            });
          }
        });
      }
    );
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
