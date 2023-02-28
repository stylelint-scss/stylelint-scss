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
  }
});

export const meta = {
  url: ruleUrl(ruleName)
};

function isNamespacedFunction(fn) {
  const namespacedFunc = /^\w+\.\w+$/;
  return namespacedFunc.test(fn);
}

function isAtUseAsSyntax(nodes) {
  const [first, second, third] = nodes.slice(-3);
  return (
    first.type === "word" &&
    first.value === "as" &&
    second.type === "space" &&
    third.type === "word"
  );
}

function getAtUseNamespace(nodes) {
  if (isAtUseAsSyntax(nodes)) {
    const [last] = nodes.slice(-1);
    return last.value;
  }
  const [first] = nodes;
  const parts = first.value.split("/");
  const [last] = parts.slice(-1);
  return last;
}

export default function rule(primaryOption, secondaryOptions) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption
      },
      {
        actual: secondaryOptions,
        possible: {
          ignoreFunctions: [isString, isRegExp]
        },
        optional: true
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
      ignoreFunctions
    });

    utils.checkAgainstRule(
      {
        ruleName: ruleToCheckAgainst,
        ruleSettings: [primaryOption, newSecondaryOptions],
        root
      },
      warning => {
        const { node, index } = warning;

        // NOTE: Using `valueParser` is necessary for extracting a function name. This may be a performance waste.
        valueParser(node.value).walk(valueNode => {
          const { type, value: funcName } = valueNode;

          if (type !== "function") {
            return;
          }

          if (isNamespacedFunction(funcName)) {
            const atUseNamespaces = [];

            root.walkAtRules(/^use$/i, atRule => {
              const { nodes } = valueParser(atRule.params);
              atUseNamespaces.push(getAtUseNamespace(nodes));
            });

            if (atUseNamespaces.length) {
              const [namespace] = funcName.split(".");
              if (atUseNamespaces.includes(namespace)) {
                return;
              }
            }
          }

          if (!ignoreFunctionsAsSet.has(funcName)) {
            utils.report({
              message: messages.rejected(funcName),
              ruleName,
              result,
              node,
              index
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
