"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("at-use-no-redundant-alias");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected redundant namespace."
});

const meta = {
  url: ruleUrl(ruleName)
};

function getDefaultNamespace(module) {
  return module.match(/([^/:]+)$/)[1].replace(/\.[^.]|["]+$/, "");
}

function separateEachParams(paramString) {
  const parts = paramString.replace(/"/g, "").split(/\s+as\s+|\s+with\s+/);
  if (parts.length < 2) return;
  return parts;
}

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("use", decl => {
      const parts = separateEachParams(decl.params);
      if (parts && getDefaultNamespace(parts[0]) === parts[1]) {
        utils.report({
          message: messages.rejected,
          node: decl,
          result,
          ruleName
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
