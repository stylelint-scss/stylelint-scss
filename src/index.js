"use strict";

const { createPlugin } = require("stylelint");
const rules = require("./rules/index.js");
const namespace = require("./utils/namespace.js");

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return createPlugin(namespace(ruleName), rules[ruleName]);
});

module.exports = rulesPlugins;
