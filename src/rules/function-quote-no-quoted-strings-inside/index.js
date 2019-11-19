"use strict";

const valueParser = require("postcss-value-parser");
const { namespace, isNativeCssFunction } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("function-quote-no-quoted-strings-inside");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Quote function used with an already-quoted string"
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
        if (node.value !== "quote") {
          return;
        }

        // Report error if first character is a quote.
        // postcss-value-parser represents quoted strings as type 'string' (as opposed to word)
        if (node.nodes[0].quote || vars[node.nodes[0].value] === "string") {
          if (context.fix) {
            const contents = /quote\((.*)\)/.exec(decl.value);

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
