import { utils } from "stylelint";
import { namespace } from "../../utils";
import valueParser from "postcss-value-parser";

export const ruleName = namespace("function-scale-color-use-always");

export const messages = utils.ruleMessages(ruleName, {
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

        if (function_names.includes(node.value)) {
          utils.report({
            message: messages.rejected,
            node: decl,
            result,
            ruleName
          });
        }
      });
    });
  };
}

export default rule;
