import namespace from "../../utils/namespace.js";
import parseNestedPropRoot from "../../utils/parseNestedPropRoot.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

const { utils } = stylelint;

const hasOwnProp = Object.prototype.hasOwnProperty;

const ruleName = namespace("declaration-nested-properties-no-divided-groups");

const messages = utils.ruleMessages(ruleName, {
  expected: prop =>
    `Expected all nested properties of "${prop}" namespace to be in one nested group`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation
    });

    if (!validOptions) {
      return;
    }

    root.walk(item => {
      if (item.type !== "rule" && item.type !== "atrule") {
        return;
      }

      const nestedGroups = {};

      // Find all nested property groups
      item.each(decl => {
        if (decl.type !== "rule") {
          return;
        }

        const testForProp = parseNestedPropRoot(decl.selector);

        if (testForProp && testForProp.propName !== undefined) {
          const ns = testForProp.propName.value;

          if (!hasOwnProp.call(nestedGroups, ns)) {
            nestedGroups[ns] = [];
          }

          nestedGroups[ns].push(decl);
        }
      });

      Object.entries(nestedGroups).forEach(([namespaceName, groups]) => {
        // Only warn if there are more than one nested groups with equal namespaces
        if (groups.length === 1) {
          return;
        }

        groups.forEach(group => {
          utils.report({
            message: messages.expected(namespaceName),
            node: group,
            result,
            ruleName,
            word: namespaceName
          });
        });
      });
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
