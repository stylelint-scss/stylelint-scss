import stylelint from "stylelint";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import valueParser from "postcss-value-parser";

const { utils } = stylelint;

const ruleName = namespace("function-calculation-no-interpolation");

const messages = utils.ruleMessages(ruleName, {
  rejected: func => `Unexpected interpolation in "${func}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    const calculationFunctions = ["calc", "max", "min", "clamp"];

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        if (node.type !== "function" || node.value === "") return;

        if (!calculationFunctions.includes(node.value)) return;

        // Interpolation is valid in SassScript.
        if (decl.type === "decl" && decl.prop.startsWith("--")) return;

        const interpolation = node.nodes.find(
          ({ type, value }) => type === "word" && /^#{.*|\s*}/.test(value)
        );
        if (!interpolation) return;

        utils.report({
          message: messages.rejected(node.value),
          node: decl,
          word: interpolation.value,
          result,
          ruleName
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
