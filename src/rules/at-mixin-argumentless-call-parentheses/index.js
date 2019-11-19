"use strict";

const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("at-mixin-argumentless-call-parentheses");

const messages = utils.ruleMessages(ruleName, {
  expected: mixin => `Expected parentheses in mixin "${mixin}" call`,
  rejected: mixin =>
    `Unexpected parentheses in argumentless mixin "${mixin}" call`
});

function rule(value, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: value,
      possible: ["always", "never"]
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("include", mixinCall => {
      // If it is "No parens in argumentless calls"
      if (
        value === "never" &&
        mixinCall.params.search(/\(\s*?\)\s*?$/) === -1
      ) {
        return;
      }

      // If it is "Always use parens"
      if (value === "always" && mixinCall.params.search(/\(/) !== -1) {
        return;
      }

      if (context.fix) {
        if (value === "always") {
          mixinCall.params = `${mixinCall.params} ()`;
        } else {
          mixinCall.params = mixinCall.params.replace(/\s*\([\s\S]*?\)$/, "");
        }

        return;
      }

      const mixinName = /\s*(\S*?)\s*(?:\(|$)/.exec(mixinCall.params)[1];

      utils.report({
        message: messages[value === "never" ? "rejected" : "expected"](
          mixinName
        ),
        node: mixinCall,
        result,
        ruleName
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
