"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("at-root-no-redundant");

function isWithinKeyframes(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === "atrule" && parent.name === "keyframes") {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected @at-root rule."
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("at-root", node => {
      if (
        node.parent.type === "root" ||
        node.params.replace(/#{.*}/g, "").includes("&") ||
        isWithinKeyframes(node)
      ) {
        utils.report({
          message: messages.rejected,
          node,
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
