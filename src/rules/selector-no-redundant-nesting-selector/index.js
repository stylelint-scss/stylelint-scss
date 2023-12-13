import stylelint from "stylelint";
import optionsMatches from "../../utils/optionsMatches.js";
import hasNestedSibling from "../../utils/hasNestedSibling.js";
import isType from "../../utils/isType.js";
import parseSelector from "../../utils/parseSelector.js";
import { isRegExp, isString } from "../../utils/validateTypes.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("selector-no-redundant-nesting-selector");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unnecessary nesting selector (&)"
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(actual, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      { actual },
      {
        actual: options,
        possible: {
          ignoreKeywords: [isString, isRegExp]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    root.walkRules(/&/, rule => {
      if (rule.selector === "&") {
        return;
      }

      parseSelector(rule.selector, result, rule, fullSelector => {
        // "Ampersand followed by a combinator followed by non-combinator non-ampersand and not the selector end"
        fullSelector.walkNesting(node => {
          const prev = node.prev();

          if (prev || hasNestedSibling(node)) {
            return;
          }

          const next = node.next();

          if (!next && node.parent.parent.nodes.length > 1) {
            return;
          }

          if (!next && node.parent.parent.type === "pseudo") {
            return;
          }

          if (next && next.type !== "combinator") {
            return;
          }

          const nextNext = next ? next.next() : null;

          if (
            (isType(nextNext, "tag") &&
              optionsMatches(
                options,
                "ignoreKeywords",
                nextNext.value.trim()
              )) ||
            isType(nextNext, "combinator")
          ) {
            return;
          }

          utils.report({
            ruleName,
            result,
            node: rule,
            message: messages.rejected,
            index: node.sourceIndex,
            endIndex: node.sourceIndex + node.value.length
          });
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
