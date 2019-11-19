"use strict";

const { namespace, optionsHaveIgnored } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("dollar-variable-default");

const messages = utils.ruleMessages(ruleName, {
  expected: variable => `Expected !default flag for "${variable}"`
});

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

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
