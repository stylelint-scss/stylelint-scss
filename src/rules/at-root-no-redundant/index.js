import stylelint from "stylelint";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";

const { utils } = stylelint;

const ruleName = namespace("at-root-no-redundant");

function isWithinKeyframes(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === "atrule" && parent.name === "keyframes") {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected @at-root rule"
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
};

function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules("at-root", node => {
      if (
        node.parent.type === "root" ||
        node.params
          .split(",")
          .every(elem => elem.replace(/#{.*}/g, "").includes("&")) ||
        isWithinKeyframes(node)
      ) {
        const fix = () => {
          node.after(node.toString().replace(/@at-root\s/, ""));
          node.next().raws = node.raws;
          node.remove();
        };

        utils.report({
          message: messages.rejected,
          node,
          result,
          ruleName,
          word: `@${node.name}`,
          fix
        });
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
