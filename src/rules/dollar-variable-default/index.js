import stylelint from "stylelint";
import optionsHaveIgnored from "../../utils/optionsHaveIgnored.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("dollar-variable-default");

const messages = utils.ruleMessages(ruleName, {
  expected: variable => `Expected !default flag for "${variable}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(primaryOption, secondaryOptions) {
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

      if (decl.value.toLowerCase().includes("!default")) {
        return;
      }

      utils.report({
        message: messages.expected(decl.prop),
        node: decl,
        result,
        ruleName
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
