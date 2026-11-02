import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

const { utils } = stylelint;

const ruleName = namespace("at-if-no-null");

const messages = utils.ruleMessages(ruleName, {
  equals_null: "Expected @if not statement rather than @if statement == null",
  not_equals_null: "Expected @if statement rather than @if statement != null"
});

const meta = {
  url: ruleUrl(ruleName)
};

// `(?![\w-])` ends the keyword: `nullable` and `null-ish` are identifiers, not null
const EQUALS_NULL = /==\s*null(?![\w-])/;
const NOT_EQUALS_NULL = /!=\s*null(?![\w-])/;
// `$x != null and $x > 1` guards the comparison that follows, so it is kept
const NULL_GUARD = /!=\s*null\s+and(?![\w-])/;

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(/^(if|else)$/, atrule => {
      // postcss-scss parses `@else if $x` as at-rule `else` with params `if $x`
      const condition =
        atrule.name === "if"
          ? atrule.params
          : atrule.params.match(/^if(?![\w-])(.*)$/s)?.[1].trim();

      if (!condition || NULL_GUARD.test(condition)) {
        return;
      }

      let message;

      if (EQUALS_NULL.test(condition)) {
        message = messages.equals_null;
      } else if (NOT_EQUALS_NULL.test(condition)) {
        message = messages.not_equals_null;
      } else {
        return;
      }

      utils.report({
        message,
        node: atrule,
        result,
        ruleName,
        word: condition
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
