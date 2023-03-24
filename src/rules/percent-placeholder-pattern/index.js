import resolveNestedSelector from "postcss-resolve-nested-selector";
import { utils } from "stylelint";
import {
  hasInterpolatingAmpersand,
  isRegExp,
  isStandardRule,
  isStandardSelector,
  isString,
  namespace,
  parseSelector,
  ruleUrl
} from "../../utils";

export const ruleName = namespace("percent-placeholder-pattern");

export const messages = utils.ruleMessages(ruleName, {
  expected: placeholder =>
    `Expected %-placeholder "%${placeholder}" to match specified pattern`
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(pattern) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: pattern,
      possible: [isRegExp, isString]
    });

    if (!validOptions) {
      return;
    }

    const placeholderPattern = isString(pattern)
      ? new RegExp(pattern)
      : pattern;

    // Checking placeholder definitions (looking among regular rules)
    root.walkRules(rule => {
      const { selector } = rule;

      // Just a shorthand for calling `parseSelector`
      function parse(selector) {
        parseSelector(selector, result, rule, s => checkSelector(s, rule));
      }

      // If it's a custom prop or a less mixin
      if (!isStandardRule(rule)) {
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
        resolveNestedSelector(selector, rule).forEach(parse);
      } else {
        parse(selector);
      }
    });

    function checkSelector(fullSelector, rule) {
      // postcss-selector-parser gives %placeholders' nodes a "tag" type
      fullSelector.walkTags(compoundSelector => {
        const { value, sourceIndex } = compoundSelector;

        if (value[0] !== "%") {
          return;
        }

        const placeholder = value.slice(1);

        if (placeholderPattern.test(placeholder)) {
          return;
        }

        utils.report({
          result,
          ruleName,
          message: messages.expected(placeholder),
          node: rule,
          index: sourceIndex
        });
      });
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
