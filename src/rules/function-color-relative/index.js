"use strict";

const valueParser = require("postcss-value-parser");
const { declarationValueIndex, namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("function-color-relative");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Expected the scale-color function to be used"
});

const function_names = [
  "saturate",
  "desaturate",
  "darken",
  "lighten",
  "opacify",
  "fade-in",
  "transparentize",
  "fade-out"
];

function isColorFunction(node) {
  return node.type === "function" && function_names.includes(node.value);
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
      valueParser(decl.value).walk(node => {
        // Verify that we're only looking at functions.
        if (node.type !== "function" || node.value === "") {
          return;
        }

        const isFilter = decl.prop === "filter";
        const isSassColorFunction = !isFilter && isColorFunction(node);
        const isDSFilterColorFunction =
          isFilter &&
          node.value === "drop-shadow" &&
          node.nodes.some(isColorFunction);

        if (isSassColorFunction || isDSFilterColorFunction) {
          const nodes = isDSFilterColorFunction
            ? node.nodes.filter(isColorFunction)
            : [node];

          nodes.forEach(node => {
            utils.report({
              message: messages.rejected,
              node: decl,
              index: declarationValueIndex(decl) + node.sourceIndex,
              result,
              ruleName
            });
          });
        }
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
