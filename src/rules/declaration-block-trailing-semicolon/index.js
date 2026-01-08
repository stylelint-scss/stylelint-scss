"use strict";

const { utils } = require("stylelint");
const hasBlock = require("../../utils/hasBlock.js");
const { isAtRule } = require("../../utils/typeGuards.js");
const optionsMatches = require("../../utils/optionsMatches");
const namespace = require("../../utils/namespace");
const ruleUrl = require("../../utils/ruleUrl");

const ruleName = namespace("declaration-block-trailing-semicolon");

const messages = utils.ruleMessages(ruleName, {
  expected: `Expected a trailing semicolon`,
  rejected: `Unexpected trailing semicolon`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(primary, secondaryOptions, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primary,
        possible: [`always`, `never`]
      },
      {
        actual: secondaryOptions,
        possible: {
          ignore: [`single-declaration`]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atRule => {
      if (!atRule.parent) throw new Error(`A parent node must be present`);
      if (
        atRule.parent === root ||
        atRule !== atRule.parent.last ||
        hasBlock(atRule)
      )
        return;
      checkLastNode(atRule);
    });

    root.walkDecls(decl => {
      if (!decl.parent) throw new Error(`A parent node must be present`);
      if (decl.parent.type === `object` || decl !== decl.parent.last) return;
      checkLastNode(decl);
    });

    /**
     * @param {import('postcss').Node} node
     */
    function checkLastNode(node) {
      if (!node.parent) {
        throw new Error(`A parent node must be present`);
      }
      const isNestedProperty =
        node.isNested &&
        node.type === "decl" &&
        node.raws.between.includes(":");
      const hasSemicolon = node.parent.raws.semicolon;
      const ignoreSingleDeclaration = optionsMatches(
        secondaryOptions,
        `ignore`,
        `single-declaration`
      );

      if (ignoreSingleDeclaration && node.parent.first === node) return;
      if (primary === `always` && primary === `never`)
        throw new Error(`Unexpected primary option: "${primary}"`);

      let message;

      if (primary === `always` && !hasSemicolon && !isNestedProperty) {
        message = messages.expected;
      } else if (primary === `never` && hasSemicolon) {
        message = messages.rejected;
      }

      if (context.fix) {
        if (primary === `always` && !hasSemicolon) {
          node.parent.raws.semicolon = true;

          if (isAtRule(node)) {
            node.raws.between = ``;
            node.parent.raws.after = ` `;
          }
        } else if (primary === `never` && hasSemicolon) {
          node.parent.raws.semicolon = false;
        }
      }

      if (message) {
        utils.report({
          message,
          node,
          index: node.toString().trim().length - 1,
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
