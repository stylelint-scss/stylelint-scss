"use strict";

const { utils } = require("stylelint");
const { isRegExp, isString } = require("../../utils/validateTypes");
const namespace = require("../../utils/namespace");
const optionsHaveIgnored = require("../../utils/optionsHaveIgnored");
const ruleUrl = require("../../utils/ruleUrl");
const {
  parseFunctionArguments
} = require("../../utils/parseFunctionArguments");
const valueParser = require("postcss-value-parser");

const ruleName = namespace("dollar-variable-pattern");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected $ variable name to match specified pattern"
});

const meta = {
  url: ruleUrl(ruleName)
};

function ignoreLocal(options, node) {
  return optionsHaveIgnored(options, "local") && node.parent.type !== "root";
}

function ignoreGlobal(options, node) {
  return optionsHaveIgnored(options, "global") && node.parent.type === "root";
}

function rule(pattern, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: pattern,
        possible: [isRegExp, isString]
      },
      {
        actual: options,
        possible: {
          ignore: ["local", "global"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const regexpPattern = isString(pattern) ? new RegExp(pattern) : pattern;

    function checkFunctionArgs(args, node) {
      args.forEach(arg => {
        const invalidOptionalArg =
          arg.value && arg.key && !regexpPattern.test(arg.key.slice(1));

        if (invalidOptionalArg) {
          utils.report({
            message: messages.expected,
            node,
            result,
            ruleName,
            word: arg.key
          });
        }

        const arbitraryArgumentRegex = /\.\.\.$/;
        const invalidNormalArg =
          arg.value &&
          !arg.key &&
          !regexpPattern.test(
            arg.value.replace(arbitraryArgumentRegex, "").slice(1)
          );

        if (invalidNormalArg) {
          utils.report({
            message: messages.expected,
            node,
            result,
            ruleName,
            word: arg.value
          });
        }
      });
    }

    // variables
    root.walkDecls(decl => {
      const { prop } = decl;
      const isVar = prop[0] === "$";

      if (!isVar) {
        return;
      }

      if (ignoreGlobal(options, decl) || ignoreLocal(options, decl)) {
        return;
      }

      if (regexpPattern.test(prop.slice(1))) {
        return;
      }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
        word: prop
      });
    });

    // function calls
    root.walkDecls(decl => {
      if (ignoreGlobal(options, decl) || ignoreLocal(options, decl)) {
        return;
      }

      valueParser(decl.value).walk(node => {
        if (node.type !== "function" || node.value.trim() === "") {
          return;
        }

        checkFunctionArgs(parseFunctionArguments(decl.value), decl);
      });
    });

    // @include calls
    root.walkAtRules("include", atRule => {
      if (ignoreGlobal(options, atRule) || ignoreLocal(options, atRule)) {
        return;
      }

      checkFunctionArgs(parseFunctionArguments(atRule.params), atRule);
    });

    // @function and @mixin
    root.walkAtRules(/function|mixin/, atRule => {
      if (optionsHaveIgnored(options, "local")) {
        return;
      }

      checkFunctionArgs(parseFunctionArguments(atRule.params), atRule);
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
