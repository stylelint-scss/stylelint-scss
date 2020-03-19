import valueParser from "postcss-value-parser";
import { utils } from "stylelint";
import { declarationValueIndex, namespace } from "../../utils";

export const ruleName = namespace("function-color-relative");

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
            index: declarationValueIndex(decl) + node.sourceIndex,
            result,
            ruleName
          });
        }
      });
    });
  };
}

export default rule;
