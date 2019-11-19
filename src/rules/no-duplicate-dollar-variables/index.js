"use strict";

const { isString } = require("lodash");
const { namespace } = require("../../utils");
const { utils } = require("stylelint");

const ruleName = namespace("no-duplicate-dollar-variables");

const messages = utils.ruleMessages(ruleName, {
  rejected: variable => `Unexpected duplicate dollar variable ${variable}`
});

function rule(value, secondaryOptions) {
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

    /**
     * Traverse the [vars] tree through the path defined by [ancestors], creating nodes as needed.
     *
     * Return the tree of the node defined by the last of [ancestors].
     */
    function getScope(ancestors) {
      let scope = vars;

      for (const node of ancestors) {
        if (!(node in scope)) {
          scope[node] = {};
        }

        scope = scope[node];
      }

      return scope;
    }

    /**
     * Returns whether [variable] is declared anywhere in the scopes along the path defined by
     * [ancestors].
     */
    function isDeclared(ancestors, variable) {
      let scope = vars;

      for (const node of ancestors) {
        scope = scope[node];

        if (scope[variable]) return true;
      }

      return false;
    }

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
        secondaryOptions.ignoreInsideAtRules.includes(decl.parent.name);

      if (
        !isVar ||
        isInsideIgnoredAtRule ||
        isInsideIgnoredNestedAtRule ||
        isInsideIgnoredSpecifiedAtRule
      ) {
        return;
      }

      const ancestors = [];
      let parent = decl.parent;

      while (parent !== null && parent !== undefined) {
        const parentKey = parent.toString();

        ancestors.unshift(parentKey);
        parent = parent.parent;
      }

      const scope = getScope(ancestors);

      if (isDeclared(ancestors, decl.prop)) {
        utils.report({
          message: messages.rejected(decl.prop),
          node: decl,
          result,
          ruleName
        });
      }

      scope[decl.prop] = true;
    });
  };
}

module.exports.rule = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
