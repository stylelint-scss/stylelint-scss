import { isRegExp, isString } from "../../utils/validateTypes.js";
import hasInterpolatingAmpersand from "../../utils/hasInterpolatingAmpersand.js";
import isStandardRule from "../../utils/isStandardRule.js";
import isStandardSelector from "../../utils/isStandardSelector.js";
import namespace from "../../utils/namespace.js";
import parseSelector from "../../utils/parseSelector.js";
import resolveNestedSelector from "postcss-resolve-nested-selector";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

const { utils } = stylelint;

const ruleName = namespace("percent-placeholder-pattern");

const messages = utils.ruleMessages(ruleName, {
  expected: (placeholderName, pattern) =>
    `Expected "${placeholderName}" to match pattern "${pattern}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(pattern) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: pattern,
      possible: [isRegExp, isString]
    });

    if (!validOptions) {
      return;
    }

    const regexpPattern = isString(pattern) ? new RegExp(pattern) : pattern;

    // Checking placeholder definitions (looking among regular rules)
    root.walkRules(ruleNode => {
      const { selector } = ruleNode;

      // Just a shorthand for calling `parseSelector`
      function parse(selectorToParse) {
        parseSelector(selectorToParse, result, ruleNode, s =>
          checkSelector(s, ruleNode)
        );
      }

      // If it's a custom prop or a less mixin
      if (!isStandardRule(ruleNode)) {
        return;
      }

      // If the selector has interpolation
      if (!isStandardSelector(selector)) {
        return;
      }

      // Nested selectors are processed in steps, as nesting levels are resolved.
      // Here we skip processing intermediate parts of selectors (to process only fully resolved selectors)
      // if (rule.nodes.some(node => node.type === "rule" || node.type === "atrule")) { return }

      // Only resolve selectors that have an interpolating "&"
      if (hasInterpolatingAmpersand(selector)) {
        resolveNestedSelector(selector, ruleNode).forEach(parse);
      } else {
        parse(selector);
      }
    });

    function checkSelector(fullSelector, ruleNode) {
      // postcss-selector-parser gives %placeholders' nodes a "tag" type
      fullSelector.walkTags(compoundSelector => {
        const { value } = compoundSelector;

        if (value[0] !== "%") {
          return;
        }

        const placeholderName = value.slice(1);

        if (regexpPattern.test(placeholderName)) {
          return;
        }

        utils.report({
          result,
          ruleName,
          message: messages.expected,
          messageArgs: [placeholderName, pattern],
          node: ruleNode,
          word: value
        });
      });
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
