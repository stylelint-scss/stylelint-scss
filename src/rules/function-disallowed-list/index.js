import { isRegExp, isString } from "../../utils/validateTypes.js";
import isNativeCssFunction from "../../utils/isNativeCssFunction.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

const { utils } = stylelint;

const ruleName = namespace("function-disallowed-list");

const messages = utils.ruleMessages(ruleName, {
  rejected: func => `Unexpected function "${func}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

// At-rules whose params start with the name of the mixin or function being
// declared or included, rather than with a function call.
const NAME_PREFIXED_AT_RULES = new Set(["function", "include", "mixin"]);

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

    // Shared check logic: find disallowed functions in a value string
    function checkValue(value, reportNode, skipFirstFunction) {
      if (!value) return;

      let firstFunctionSkipped = !skipFirstFunction;

      valueParser(value).walk(valueNode => {
        if (valueNode.type !== "function") {
          return;
        }

        // The name of the mixin or function being declared or included, not a
        // call. Its arguments are still checked.
        if (!firstFunctionSkipped) {
          firstFunctionSkipped = true;

          return;
        }

        if (isNativeCssFunction(valueNode.value) || valueNode.value === "") {
          return;
        }

        const hasNamespace = valueNode.value.indexOf(".");
        const nameWithoutNamespace =
          hasNamespace > -1
            ? valueNode.value.slice(hasNamespace + 1)
            : valueNode.value;

        disallowedFunctions.forEach(functionName => {
          if (
            (isString(functionName) && nameWithoutNamespace === functionName) ||
            (isRegExp(functionName) && nameWithoutNamespace.match(functionName))
          ) {
            utils.report({
              message: messages.rejected(nameWithoutNamespace),
              node: reportNode,
              word: nameWithoutNamespace,
              result,
              ruleName
            });
          }
        });
      });
    }

    root.walkDecls(decl => {
      checkValue(decl.value, decl);
    });

    // Functions can appear in the params of any at-rule, e.g. `@if`, `@media`,
    // `@each`, `@return`, or as an argument to a mixin.
    root.walkAtRules(atRule => {
      checkValue(
        atRule.params,
        atRule,
        NAME_PREFIXED_AT_RULES.has(atRule.name.toLowerCase())
      );
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
