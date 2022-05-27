import { utils } from "stylelint";
import optionsMatches from "stylelint/lib/utils/optionsMatches";
import { isString, isRegExp } from "lodash";
import {
  namespace,
  parseSelector,
  hasNestedSibling,
  isType,
  ruleUrl
} from "../../utils";

export const ruleName = namespace("selector-no-redundant-nesting-selector");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unnecessary nesting selector (&)"
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(actual, options) {
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
            index: node.sourceIndex
          });
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
