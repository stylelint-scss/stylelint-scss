"use strict";

const valueParser = require("postcss-value-parser");
const { utils } = require("stylelint");
const declarationValueIndex = require("../../utils/declarationValueIndex.js");
const namespace = require("../../utils/namespace.js");
const ruleUrl = require("../../utils/ruleUrl.js");

const ruleName = namespace("function-color-relative");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Expected the scale-color function to be used"
});

const meta = {
  url: ruleUrl(ruleName)
};

const functionNames = new Set([
  "saturate",
  "desaturate",
  "darken",
  "lighten",
  "opacify",
  "fade-in",
  "transparentize",
  "fade-out"
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
          node.nodes.some(n => isColorFunction(n));

        if (isSassColorFunction || isDSFilterColorFunction) {
          const nodes = isDSFilterColorFunction
            ? node.nodes.filter(n => isColorFunction(n))
            : [node];

          for (const node of nodes) {
            utils.report({
              message: messages.rejected,
              node: decl,
              index: declarationValueIndex(decl) + node.sourceIndex,
              result,
              ruleName
            });
          }
        }
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
