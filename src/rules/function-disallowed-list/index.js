import stylelint from "stylelint";
import { isRegExp, isString } from "../../utils/validateTypes.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import valueParser from "postcss-value-parser";
import isNativeCssFunction from "../../utils/isNativeCssFunction.js";

const { utils } = stylelint;

const ruleName = namespace("function-disallowed-list");

const messages = utils.ruleMessages(ruleName, {
  rejected: func => `Unexpected function "${func}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(disallowedOption) {
  const disallowedFunctions = [].concat(disallowedOption);

  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: disallowedOption,
      possible: [isString, isRegExp]
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        if (
          node.type !== "function" ||
          isNativeCssFunction(node.value) ||
          node.value === ""
        ) {
          return;
        }

        const hasNamespace = node.value.indexOf(".");
        const nameWithoutNamespace =
          hasNamespace > -1 ? node.value.slice(hasNamespace + 1) : node.value;
        disallowedFunctions.forEach(functionName => {
          if (
            (isString(functionName) && nameWithoutNamespace === functionName) ||
            (isRegExp(functionName) && nameWithoutNamespace.match(functionName))
          ) {
            utils.report({
              message: messages.rejected(nameWithoutNamespace),
              node: decl,
              word: nameWithoutNamespace,
              result,
              ruleName
            });
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
