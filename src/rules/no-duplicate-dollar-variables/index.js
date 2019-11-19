import { utils } from "stylelint";
import isString from "lodash.isstring";
import { namespace } from "../../utils";

export const ruleName = namespace("no-duplicate-dollar-variables");

export const messages = utils.ruleMessages(ruleName, {
  rejected: variable => `Unexpected duplicate dollar variable ${variable}`
});

export default function(value, secondaryOptions) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: value
      },
      {
        actual: secondaryOptions,
        possible: {
          ignoreInside: ["at-rule", "nested-at-rule"],
          ignoreInsideAtRules: [isString]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const vars = {};

    root.walkDecls(decl => {
      const isVar = decl.prop[0] === "$";
      const isInsideIgnoredAtRule =
        decl.parent.type === "atrule" &&
        secondaryOptions &&
        secondaryOptions.ignoreInside &&
        secondaryOptions.ignoreInside === "at-rule";
      const isInsideIgnoredNestedAtRule =
        decl.parent.type === "atrule" &&
        decl.parent.parent.type !== "root" &&
        secondaryOptions &&
        secondaryOptions.ignoreInside &&
        secondaryOptions.ignoreInside === "nested-at-rule";
      const isInsideIgnoredSpecifiedAtRule =
        decl.parent.type === "atrule" &&
        secondaryOptions &&
        secondaryOptions.ignoreInsideAtRules &&
        secondaryOptions.ignoreInsideAtRules.indexOf(decl.parent.name) > -1;

      if (
        !isVar ||
        isInsideIgnoredAtRule ||
        isInsideIgnoredNestedAtRule ||
        isInsideIgnoredSpecifiedAtRule
      ) {
        return;
      }

      if (vars[decl.prop]) {
        utils.report({
          message: messages.rejected(decl.prop),
          node: decl,
          result,
          ruleName
        });
      }

      vars[decl.prop] = true;
    });
  };
}
