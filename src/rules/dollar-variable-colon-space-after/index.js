"use strict";

const { utils } = require("stylelint");
const declarationValueIndex = require("../../utils/declarationValueIndex");
const isSingleLineString = require("../../utils/isSingleLineString");
const whitespaceChecker = require("../../utils/whitespaceChecker");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("dollar-variable-colon-space-after");

const messages = utils.ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after ":"',
  rejectedAfter: () => 'Unexpected whitespace after ":"',
  expectedAfterSingleLine: () =>
    'Expected single space after ":" with a single-line value',
  expectedAfterAtLeast: () => 'Expected at least one space after ":"'
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(expectation, _, context) {
  const checker = whitespaceChecker("space", expectation, messages);

  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never", "always-single-line", "at-least-one-space"]
    });

    if (!validOptions) {
      return;
    }

    variableColonSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
      position: "after",
      expectation,
      context
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

function variableColonSpaceChecker({
  locationChecker,
  root,
  result,
  checkedRuleName,
  position,
  expectation,
  context
}) {
  root.walkDecls(decl => {
    if (decl.prop === undefined || decl.prop[0] !== "$") {
      return;
    }

    if (context && context.fix) {
      if (
        expectation === "always-single-line" &&
        !isSingleLineString(decl.value)
      ) {
        return;
      }

      if (position === "before") {
        const replacement = expectation === "never" ? ":" : " :";

        decl.raws.between = decl.raws.between.replace(/\s*:/, replacement);
      } else if (position === "after") {
        const match = expectation === "at-least-one-space" ? /:(?! )/ : /:\s*/;
        const replacement = expectation === "never" ? ":" : ": ";

        decl.raws.between = decl.raws.between.replace(match, replacement);
      }

      return;
    }

    // Get the raw $var, and only that
    const endOfPropIndex =
      declarationValueIndex(decl) + decl.raw("between").length - 1;
    // `$var:`, `$var :`
    const propPlusColon = decl.toString().slice(0, endOfPropIndex);

    for (let i = 0; i < propPlusColon.length; i++) {
      if (propPlusColon[i] !== ":") {
        continue;
      }

      locationChecker({
        source: propPlusColon,
        index: i,
        lineCheckStr: decl.value,
        err: m => {
          utils.report({
            message: m,
            node: decl,
            index: i,
            result,
            ruleName: checkedRuleName
          });
        }
      });
      break;
    }
  });
}

module.exports = rule;
module.exports.variableColonSpaceChecker = variableColonSpaceChecker;
