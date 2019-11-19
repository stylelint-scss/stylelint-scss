"use strict";

const { namespace, parseSelector } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("selector-no-redundant-nesting-selector");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unnecessary nesting selector (&)"
});

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkRules(/&/, rule => {
      parseSelector(rule.selector, result, rule, fullSelector => {
        // "Ampersand followed by a combinator followed by non-combinator non-ampersand and not the selector end"
        fullSelector.walkNesting(node => {
          const prev = node.prev();

          if (prev) {
            return;
          }

          const next = node.next();

          if (!next && node.parent.parent.nodes.length > 1) {
            return;
          }

          if (next && next.type !== "combinator") {
            return;
          }

          const nextNext = next ? next.next() : null;

          if (
            nextNext &&
            (nextNext.type === "combinator" || nextNext.type === "nesting")
          ) {
            return;
          }

          utils.report({
            ruleName,
            result,
            node: rule,
            message: messages.rejected,
            index: node.sourceIndex
          });
        });
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
