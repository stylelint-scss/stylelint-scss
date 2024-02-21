"use strict";

const { utils } = require("stylelint");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("no-unused-private-members");

const messages = utils.ruleMessages(ruleName, {
  expected: privateMember =>
    `Expected usage of private member "${privateMember}" within the stylesheet.`
});

const meta = {
  url: ruleUrl(ruleName)
};

function extractFunctionName(inputString) {
  const matches = [...inputString.matchAll(/(?:\s*([\w\-$]+)\s*)?\(/g)].flat();
  return matches;
}

function extractFunctionArgs(inputString) {
  const matches = [...inputString.matchAll(/\(([^()]*)\)/g)].flat();
  return matches.length > 0 ? matches[1].split(",") : [];
}

function rule(primaryOption) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primaryOption
    });

    if (!validOptions) {
      return;
    }

    const privateMembers = {
      selectors: new Map(),
      variables: new Map(),
      functions: new Map(),
      mixins: new Map()
    };

    // Skip for files using @import.
    let hasImport = false;
    root.walkAtRules("import", () => (hasImport = true));
    if (hasImport) return;

    root.walk(node => {
      // Private placeholder selectors
      const isPrivatePlaceholderSelector =
        node.type === "rule" &&
        (node.selector.includes("%-") || node.selector.includes("%_"));
      if (isPrivatePlaceholderSelector) {
        const selectors = node.selector
          .split(/:|\./g)
          .filter(
            selector => selector.startsWith("%-") | selector.includes("%_")
          );
        selectors.forEach(selector => {
          if (!privateMembers.selectors.has(selector)) {
            privateMembers.selectors.set(selector, node);
          }
        });
      }

      // Private variables
      const isPrivateVariable =
        node.type === "decl" &&
        (node.prop.startsWith("$-") || node.prop.startsWith("$_"));
      if (isPrivateVariable) {
        privateMembers.variables.set(node.prop, node);
      }

      // Private functions
      const isPrivateFunction =
        node.type === "atrule" &&
        node.name === "function" &&
        (node.params.startsWith("-") || node.params.startsWith("_"));
      if (isPrivateFunction) {
        const match = extractFunctionName(node.params);
        if (match.length < 2) return;
        privateMembers.functions.set(match[1], node);
      }

      // Private mixins
      const isPrivateMixin =
        node.type === "atrule" &&
        node.name === "mixin" &&
        (node.params.startsWith("-") || node.params.startsWith("_"));
      if (isPrivateMixin) {
        const match = extractFunctionName(node.params);
        privateMembers.mixins.set(
          match.length < 2 ? node.params : match[1],
          node
        );
      }
    });

    root.walkAtRules(node => {
      if (node.name === "extend" && privateMembers.selectors.has(node.params)) {
        privateMembers.selectors.delete(node.params);
      }

      const param = extractFunctionName(node.params)[1]
        ? extractFunctionName(node.params)[1]
        : node.params;
      if (node.name === "include" && privateMembers.mixins.has(param)) {
        privateMembers.mixins.delete(param);
      }

      const params = extractFunctionArgs(node.params);
      if (node.name === "include" && params) {
        params.forEach(param => {
          const isThemeDeclaration = param.split(":");
          if (isThemeDeclaration.length > 1) {
            const value = isThemeDeclaration[1].trim();
            if (privateMembers.variables.has(value)) {
              privateMembers.variables.delete(value);
            }
          }
          if (privateMembers.variables.has(param)) {
            privateMembers.variables.delete(param);
          }
        });
      }
    });

    root.walkDecls(decls => {
      const hasFunctions = extractFunctionName(decls.value);
      hasFunctions.forEach(func => {
        if (privateMembers.functions.has(func)) {
          privateMembers.functions.delete(func);
        }
      });

      // Functions in values like map.get
      const params = extractFunctionArgs(decls.value);
      if (params) {
        params.forEach(param => {
          if (privateMembers.variables.has(param)) {
            privateMembers.variables.delete(param);
          }
        });
      }

      if (privateMembers.variables.has(decls.value)) {
        privateMembers.variables.delete(decls.value);
      }
    });

    for (const types in privateMembers) {
      for (const [key, value] of privateMembers[types].entries()) {
        utils.report({
          message: messages.expected(key),
          node: value,
          result,
          ruleName
        });
      }
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

module.exports = rule;
