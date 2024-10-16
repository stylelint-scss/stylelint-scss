import valueParser from "postcss-value-parser";
import stylelint from "stylelint";
import declarationValueIndex from "../../utils/declarationValueIndex.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("function-color-channel");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected the color.channel function to be used"
});

const meta = {
  url: ruleUrl(ruleName)
};

const functionNames = new Set([
  "color.alpha",
  "color.blackness",
  "color.blue",
  "color.green",
  "color.hue",
  "color.lightness",
  "color.red",
  "color.saturation",
  "color.whiteness",
  "alpha",
  "blackness",
  "blue",
  "green",
  "hue",
  "lightness",
  "opacity",
  "red",
  "saturation"
]);

function isColorFunction(node) {
  return node.type === "function" && functionNames.has(node.value);
}

function rule(primary) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      const declValueIndex = declarationValueIndex(decl);

      valueParser(decl.value).walk(node => {
        if (node.type !== "function" || node.value === "") {
          return;
        }

        const isFilter = decl.prop === "filter";
        const isSassColorFunction = !isFilter && isColorFunction(node);

        if (isSassColorFunction) {
          const index = declValueIndex + node.sourceIndex;
          utils.report({
            message: messages.expected,
            node: decl,
            index,
            endIndex: index + node.value.length,
            result,
            ruleName
          });
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
