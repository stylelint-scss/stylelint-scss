import namespace from "./utils/namespace.js";
import rules from "./rules/index.js";
import stylelint from "stylelint";

const { createPlugin } = stylelint;

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return createPlugin(namespace(ruleName), rules[ruleName]);
});

export default rulesPlugins;
