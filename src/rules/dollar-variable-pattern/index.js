import stylelint from "stylelint";
import { isRegExp, isString } from "../../utils/validateTypes.js";
import namespace from "../../utils/namespace.js";
import optionsHaveIgnored from "../../utils/optionsHaveIgnored.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("dollar-variable-pattern");

const messages = utils.ruleMessages(ruleName, {
  expected: "Expected $ variable name to match specified pattern"
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(pattern, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: pattern,
        possible: [isRegExp, isString]
      },
      {
        actual: options,
        possible: {
          ignore: ["local", "global"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const regexpPattern = isString(pattern) ? new RegExp(pattern) : pattern;

    root.walkDecls(decl => {
      const { prop } = decl;

      if (prop[0] !== "$") {
        return;
      }

      // If local or global variables need to be ignored
      if (
        (optionsHaveIgnored(options, "global") &&
          decl.parent.type === "root") ||
        (optionsHaveIgnored(options, "local") && decl.parent.type !== "root")
      ) {
        return;
      }

      if (regexpPattern.test(prop.slice(1))) {
        return;
      }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName,
        word: prop
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
