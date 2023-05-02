"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace.js");
const parseSelector = require("../../utils/parseSelector.js");
const ruleUrl = require("../../utils/ruleUrl.js");

const ruleName = namespace("selector-nest-combinators");

const messages = utils.ruleMessages(ruleName, {
  expectedInterpolation: `Expected interpolation to be in a nested form`,
  expected: (combinator, type) =>
    `Expected combinator "${combinator}" of type "${type}" to be in a nested form`,
  rejected: `Unexpected nesting found in selector`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    function precedesParentSelector(current) {
      do {
        current = current.next();

        if (current.type === "nesting") {
          return true;
        }
      } while (current.next());

      return false;
    }

    // attribute, class, combinator, comment, id, nesting, pseudo, root, selector, string, tag, or universal
    const chainingTypes = new Set([
      "attribute",
      "class",
      "id",
      "pseudo",
      "tag",
      "universal"
    ]);

    const interpolationRe = /#{.+?}$/;

    root.walkRules(rule => {
      if (
        rule.parent &&
        rule.parent.type === "atrule" &&
        rule.parent.name === "keyframes"
      ) {
        return;
      }

      if (typeof rule.selector === "string") {
        const isNestedProperty = rule.selector.slice(-1) === ":";

        if (isNestedProperty) {
          return;
        }
      }

      parseSelector(rule.selector, result, rule, fullSelector => {
        let message;

        fullSelector.walk(node => {
          if (node.value === "}") {
            return;
          }

          if (expectation === "always") {
            if (node.type === "selector") {
              return;
            }

            if (
              node.parent &&
              node.parent.type === "selector" &&
              node.parent.parent &&
              node.parent.parent.type === "pseudo"
            ) {
              return;
            }

            if (!node.prev()) {
              return;
            }

            if (node.next() && precedesParentSelector(node)) {
              return;
            }

            if (node.type === "combinator") {
              if (node.next() && !chainingTypes.has(node.next().type)) {
                return;
              }

              if (!chainingTypes.has(node.prev().type)) {
                return;
              }
            }

            if (
              chainingTypes.has(node.type) &&
              !chainingTypes.has(node.prev().type)
            ) {
              return;
            }

            if (node.type !== "combinator" && !chainingTypes.has(node.type)) {
              return;
            }

            const hasInterpolation = interpolationRe.test(rule.selector);

            if (node.type !== "combinator" && hasInterpolation) {
              return;
            }

            message = hasInterpolation
              ? messages.expectedInterpolation
              : messages.expected(node.value, node.type);
          }

          if (expectation === "never") {
            if (rule.parent.type === "root" || rule.parent.type === "atrule") {
              return;
            }

            message = messages.rejected;
          }

          utils.report({
            ruleName,
            result,
            node: rule,
            message,
            index: node.sourceIndex
          });
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
