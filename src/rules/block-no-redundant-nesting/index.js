"use strict";

const resolveNestedSelector = require("postcss-resolve-nested-selector");
const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("block-no-redundant-nesting");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected nesting for single child block"
});

const meta = {
  url: ruleUrl(ruleName)
};

function processRuleNode(ruleNode, result, context) {
  if (ruleNode.nodes.length !== 1) {
    return;
  }

  const nestedRuleNode = ruleNode.nodes[0];
  if (
    nestedRuleNode.type !== "rule" ||
    nestedRuleNode.selector.endsWith(":") ||
    ruleNode.selectors.length !== 1 ||
    nestedRuleNode.selectors.length !== 1
  ) {
    return;
  }

  if (context.fix) {
    ruleNode.selector = resolveNestedSelector(
      nestedRuleNode.selector,
      nestedRuleNode
    )[0];
    ruleNode.nodes = nestedRuleNode.nodes;

    if (ruleNode.nodes.length === 1) {
      for (const rule of ruleNode.nodes) {
        rule.parent = ruleNode;
      }
      processRuleNode(ruleNode, result, context);
    }
    return;
  }

  utils.report({
    message: messages.rejected,
    node: nestedRuleNode,
    result,
    ruleName
  });
}

function rule(actual, _, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual
    });

    if (!validOptions) {
      return;
    }

    root.walkRules(ruleNode => processRuleNode(ruleNode, result, context));
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
