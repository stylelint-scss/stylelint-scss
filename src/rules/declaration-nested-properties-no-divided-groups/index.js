import namespace from "../../utils/namespace.js";
import parseNestedPropRoot from "../../utils/parseNestedPropRoot.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

const { utils } = stylelint;

const ruleName = namespace("declaration-nested-properties-no-divided-groups");

const messages = utils.ruleMessages(ruleName, {
  expected: prop =>
    `Expected all nested properties of "${prop}" namespace to be in one nested group`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(primary) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walk(node => {
      if (node.type !== "rule" && node.type !== "atrule") {
        return;
      }

      /** @type {Map<string, Array<import('postcss').Declaration | import('postcss').Rule>>} */
      const nestedGroups = new Map();

      // Find all nested property groups
      node.each(child => {
        const { type, prop, value, selector } = child;

        if (type !== "rule" && !(type === "decl" && child.isNested)) {
          return;
        }

        const parsedProp = parseNestedPropRoot(selector || `${prop}: ${value}`);

        if (parsedProp?.propName === undefined) {
          return;
        }

        const propNamespace = parsedProp.propName.value;

        if (!nestedGroups.has(propNamespace)) {
          nestedGroups.set(propNamespace, []);
        }

        nestedGroups.get(propNamespace).push(child);
      });

      for (const [namespaceName, groupNodes] of nestedGroups) {
        if (groupNodes.length === 1) {
          continue;
        }

        for (const groupNode of groupNodes) {
          utils.report({
            message: messages.expected(namespaceName),
            node: groupNode,
            result,
            ruleName,
            word: namespaceName
          });
        }
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
