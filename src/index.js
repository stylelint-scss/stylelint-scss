"use strict";

const rules = require("./rules");
const { createPlugin } = require("stylelint");
const { namespace } = require("./utils");

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return createPlugin(namespace(ruleName), rules[ruleName]);
});

module.exports = rulesPlugins;
