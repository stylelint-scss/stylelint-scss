import { isWithinMixin } from "../../utils/isWithinMixin.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

const { utils } = stylelint;

const ruleName = namespace("at-mixin-no-risky-nesting-selector");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected nested parent selector in @mixin rule"
});

const meta = {
  url: ruleUrl(ruleName)
};

function hasNestedParentSelector(selectors) {
  return selectors
    .split(",")
    .some(
      selector =>
        selector.includes("&") && /\s*\S+\s*&/.test(selector.replace(" ", ""))
    );
}

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkRules(node => {
      if (
        node.selector?.includes("&") &&
        isWithinMixin(node) &&
        hasNestedParentSelector(node.selector) &&
        node.parent.selector
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

export default rule;
