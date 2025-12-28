import stylelint from "stylelint";
import resolveNestedSelector from "postcss-resolve-nested-selector";
import { isBoolean, isRegExp, isString } from "../../utils/validateTypes.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import hasInterpolatingAmpersand from "../../utils/hasInterpolatingAmpersand.js";
import isStandardRule from "../../utils/isStandardRule.js";
import isStandardSyntaxSelector from "../../utils/isStandardSyntaxSelector.js";
import parseSelector from "../../utils/parseSelector.js";

const { utils } = stylelint;

const ruleName = namespace("selector-class-pattern");

const messages = utils.ruleMessages(ruleName, {
  expected: (selector, pattern) =>
    `Expected "${selector}" to match pattern "${pattern}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

/** @type {import('stylelint').CoreRules[ruleName]} */
const rule = (primary, secondaryOptions) => {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primary,
        possible: [isRegExp, isString]
      },
      {
        actual: secondaryOptions,
        possible: {
          resolveNestedSelectors: [isBoolean]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const shouldResolveNestedSelectors = Boolean(
      secondaryOptions && secondaryOptions.resolveNestedSelectors
    );

    const normalizedPattern = isString(primary) ? new RegExp(primary) : primary;

    root.walkRules(ruleNode => {
      if (!isStandardRule(ruleNode)) {
        return;
      }

      if (
        ruleNode.parent &&
        ruleNode.parent.type === "atrule" &&
        ruleNode.parent.name === "keyframes"
      ) {
        return;
      }

      // Only bother resolving selectors that have an interpolating &
      const ruleSelector =
        ruleNode.raws && ruleNode.raws.selector && ruleNode.raws.selector.raw
          ? ruleNode.raws.selector.raw
          : ruleNode.selector;

      if (
        shouldResolveNestedSelectors &&
        hasInterpolatingAmpersand(ruleSelector)
      ) {
        for (const nestedSelector of resolveNestedSelector(
          ruleSelector,
          ruleNode
        )) {
          if (!isStandardSyntaxSelector(nestedSelector)) {
            continue;
          }

          parseSelector(nestedSelector, result, ruleNode, selectorRoot => {
            if (selectorRoot) checkSelector(selectorRoot, ruleNode);
          });
        }
      } else {
        parseSelector(ruleSelector, result, ruleNode, selectorRoot => {
          if (selectorRoot) checkSelector(selectorRoot, ruleNode);
        });
      }
    });

    /**
     * @param {import('postcss-selector-parser').Root} selectorNode
     * @param {import('postcss').Rule} ruleNode
     */
    function checkSelector(selectorNode, ruleNode) {
      selectorNode.walkClasses(classNode => {
        const { value, sourceIndex: index } = classNode;

        if (normalizedPattern.test(value)) {
          return;
        }

        const selector = String(classNode).trim();

        // `selector` may be resolved. So, getting its raw value may be pretty hard.
        // It means `endIndex` may be inaccurate (though non-standard selectors).
        //
        // For example, given ".abc { &_x {} }".
        // Then, an expected raw `selector` is "&_x",
        // but, an actual `selector` is ".abc_x".
        // See:
        // - https://github.com/stylelint/stylelint/issues/6234
        // - https://github.com/stylelint/stylelint/issues/7482
        const endIndex = index + selector.length;

        utils.report({
          ruleName,
          result,
          node: ruleNode,
          message: messages.expected(selector, primary),
          index,
          endIndex
        });
      });
    }
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
