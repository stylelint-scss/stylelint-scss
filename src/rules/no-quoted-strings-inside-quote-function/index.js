import { utils } from "stylelint";
import { namespace, isNativeCssFunction } from "../../utils";
import valueParser from "postcss-value-parser";
import { isContext } from "vm";

export const ruleName = namespace("no-quoted-strings-inside-quote-function");

export const messages = utils.ruleMessages(ruleName, {
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
        if (node.nodes[0].quote) {
          if (context.fix) {
            var contents = /quote\((.*)\)/.exec(decl.value);
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

export default rule;
