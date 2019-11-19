"use strict";

const { namespace, optionsHaveIgnored } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("media-feature-value-dollar-variable");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected dollar-variable as a media feature value",
  expected:
    "Expected a dollar-variable (e.g. $var) to be used as a media feature value"
});

function rule(expectation, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["always", "never"]
      },
      {
        actual: options,
        possible: {
          ignore: ["keywords"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const valueRegex = /:(?:\s*?)(\S.+?)(:?\s*?)\)/;
    // In `(max-width: 10px )` find `: 10px )`.
    // Got to go with that (the global search doesn't remember parens' insides)
    // and parse it again afterwards to remove trailing junk
    const valueRegexGlobal = new RegExp(valueRegex.source, "g");
    // `$var-name_sth`
    const variableRegex = /^\$[A-Za-z_0-9-]+$/;
    // `#{$var-name_sth}`
    const interpolationVarRegex = /^#\{\s*?\$[A-Za-z_0-9]+\s*?\}$/;
    // `none`, `dark`
    const keywordValueRegex = /^[a-z][a-z0-9-]*$/;

    root.walkAtRules("media", atRule => {
      const found = atRule.params.match(valueRegexGlobal);

      // If there are no values
      if (!found || !found.length) {
        return;
      }

      found.forEach(found => {
        // ... parse `: 10px )` to `10px`
        const valueParsed = found.match(valueRegex)[1];

        // Just a shorthand to stylelint.utils.report()
        function complain(message) {
          utils.report({
            ruleName,
            result,
            node: atRule,
            word: valueParsed,
            message
          });
        }

        // Keyword values, like `none`, should always be fine if keywords are
        // ignored.
        if (
          keywordValueRegex.test(valueParsed) &&
          optionsHaveIgnored(options, "keywords")
        ) {
          return;
        }

        // A value should be a single variable
        // or it should be a single variable inside Sass interpolation
        if (
          expectation === "always" &&
          !(
            variableRegex.test(valueParsed) ||
            interpolationVarRegex.test(valueParsed)
          )
        ) {
          complain(messages.expected);
        } else if (expectation === "never" && valueParsed.includes("$")) {
          // "Never" means no variables at all (functions allowed)
          complain(messages.rejected);
        }
      });
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
