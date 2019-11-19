"use strict";

const valueParser = require("postcss-value-parser");
const { namespace, isNativeCssFunction } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("function-unquote-no-unquoted-strings-inside");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unquote function used with an already-unquoted string"
});

function rule(primary, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    // Setup variable naming.
    const vars = {};

    root.walkDecls(decl => {
      if (decl.prop[0] !== "$") {
        return;
      }

      valueParser(decl.value).walk(node => {
        vars[decl.prop] = node.type;
      });
    });

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        // Verify that we're only looking at functions.
        if (
          node.type !== "function" ||
          isNativeCssFunction(node.value) ||
          node.value === ""
        ) {
          return;
        }

        // Verify we're only looking at quote() calls.
        if (node.value !== "unquote") {
          return;
        }

        // Report error if first character is a quote.
        // postcss-value-parser represents quoted strings as type 'string' (as opposed to word)
        if (
          (!node.nodes[0].quote && node.nodes[0].value[0] !== "$") ||
          vars[node.nodes[0].value] === "word"
        ) {
          if (context.fix) {
            const contents = /unquote\((.*)\)/.exec(decl.value);

            decl.value = contents[1];
          } else {
            utils.report({
              message: messages.rejected,
              node: decl,
              result,
              ruleName
            });
          }
        }
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
