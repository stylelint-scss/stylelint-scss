import { isRegExp, isString } from "../../utils/validateTypes.js";
import hasNestedSibling from "../../utils/hasNestedSibling.js";
import isType from "../../utils/isType.js";
import namespace from "../../utils/namespace.js";
import optionsMatches from "../../utils/optionsMatches.js";
import parseSelector from "../../utils/parseSelector.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

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

    root.walkRules(/&/, ruleNode => {
      if (ruleNode.selector === "&") {
        return;
      }

      parseSelector(ruleNode.selector, result, ruleNode, fullSelector => {
        // "Ampersand followed by a combinator followed by non-combinator non-ampersand and not the selector end"
        fullSelector.walkNesting(node => {
          const prev = node.prev();

          if (prev || hasNestedSibling(node) || hasOtherNesting(node)) {
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
            node: ruleNode,
            message: messages.rejected,
            index: node.sourceIndex,
            endIndex: node.sourceIndex + node.value.length
          });
        });
      });
    });
  };
}

/**
 * Whether the complex selector containing the node has another nesting
 * selector, for example inside a pseudo-class: `& > .bar:not(&--1)`.
 */
function hasOtherNesting(node) {
  let selector = node.parent;

  while (selector.parent && selector.parent.type !== "root") {
    selector = selector.parent;
  }

  let found = false;

  selector.walkNesting(nesting => {
    if (nesting !== node) {
      found = true;

      return false;
    }
  });

  return found;
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
