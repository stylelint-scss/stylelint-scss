"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");
const valueParser = require("postcss-value-parser");

const ruleName = namespace("function-calculation-no-interpolation");

const messages = utils.ruleMessages(ruleName, {
  rejected: func => `Unexpected interpolation in "${func}".`
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
        if (node.type !== "function" || node.value === "") {
          return;
        }
        if (
          calculationFunctions.includes(node.value) &&
          node.nodes.some(
            args => args.type === "word" && /^#{.*|\s*}/.test(args.value)
          )
        ) {
          utils.report({
            message: messages.rejected(node.value),
            node: decl,
            word: decl.name,
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

module.exports = rule;
