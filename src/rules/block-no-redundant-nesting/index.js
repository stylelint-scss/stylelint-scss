import stylelint from "stylelint";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("block-no-redundant-nesting");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected nesting for single child block"
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
};

function resolveNestedSelector(parentSelector, nestedSelector) {
  if (nestedSelector.includes("&")) {
    return nestedSelector.replace(/&/g, parentSelector);
  }
  return [parentSelector, nestedSelector].join(" ");
}

function processRuleNode(ruleNode, result) {
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

  const fix = () => {
    ruleNode.selector = resolveNestedSelector(
      ruleNode.selector,
      nestedRuleNode.selector
    );
    ruleNode.nodes = nestedRuleNode.nodes;
    ruleNode.raws.semicolon = nestedRuleNode.raws.semicolon;

    if (ruleNode.nodes.length === 1) {
      for (const rule of ruleNode.nodes) {
        rule.parent = ruleNode;
      }
      processRuleNode(ruleNode, result);
    }
  };

  utils.report({
    message: messages.rejected,
    node: nestedRuleNode,
    result,
    ruleName,
    fix
  });
}

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual
    });

    if (!validOptions) {
      return;
    }

    root.walkRules(ruleNode => processRuleNode(ruleNode, result));
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
