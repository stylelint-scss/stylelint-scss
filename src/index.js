import stylelint from "stylelint";
import rules from "./rules/index.js";
import namespace from "./utils/namespace.js";

const { createPlugin } = stylelint;

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return createPlugin(namespace(ruleName), rules[ruleName]);
});

export default rulesPlugins;
