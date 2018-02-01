import { utils } from "stylelint";
import { namespace, optionsHaveIgnored } from "../../utils";

export const ruleName = namespace("dollar-variable-default");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected !default flag for $variable"
});

export default function(primaryOption, secondaryOptions) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primaryOption
      },
      {
        actual: secondaryOptions,
        possible: {
          ignore: ["local"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      // not variable
      if (decl.prop[0] !== "$") {
        return;
      }

      // "ignore" options
      if (
        optionsHaveIgnored(secondaryOptions, "local") &&
        decl.parent.type !== "root"
      ) {
        return;
      }

      if (decl.value.toLowerCase().indexOf("!default") !== -1) {
        return;
      }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName
      });
    });
  };
}
