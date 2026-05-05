import isStandardSyntaxProperty from "../../utils/isStandardSyntaxProperty.js";
import namespace from "../../utils/namespace.js";
import optionsHaveException from "../../utils/optionsHaveException.js";
import parseNestedPropRoot from "../../utils/parseNestedPropRoot.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

const { utils } = stylelint;

const ruleName = namespace("declaration-nested-properties");

const messages = utils.ruleMessages(ruleName, {
  expected: prop => `Expected property "${prop}" to be in a nested form`,
  rejected: prop => `Unexpected nested property "${prop}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

function rule(primary, secondaryOptions) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primary,
        possible: ["always", "never"]
      },
      {
        actual: secondaryOptions,
        possible: {
          except: ["only-of-namespace"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const exceptIfOnlyOfNamespace = optionsHaveException(
      secondaryOptions,
      "only-of-namespace"
    );

    if (primary === "always") {
      root.walk(node => {
        if (node.type !== "rule" && node.type !== "atrule") {
          return;
        }

        /** @type {Map<string, Array<{ node: import('postcss').Declaration | import('postcss').Rule, nested?: true }>>} */
        const warningCandidates = new Map();

        node.each(child => {
          const { type, prop, value, selector } = child;

          if (type !== "decl" && type !== "rule") {
            return;
          }

          // Non-nested namespaced properties (browser-prefixed props are ignored)
          if (type === "decl" && !child.isNested) {
            if (!isStandardSyntaxProperty(prop)) {
              return;
            }

            const namespaceMatch = /^([a-z\d]+)-/i.exec(prop);

            if (!namespaceMatch?.[1]) {
              return;
            }

            const propNamespace = namespaceMatch[1];

            if (!warningCandidates.has(propNamespace)) {
              warningCandidates.set(propNamespace, []);
            }

            warningCandidates.get(propNamespace).push({ node: child });

            return;
          }

          // Nested props, `prop: [value] { <nested decls> }`
          const parsedProp = parseNestedPropRoot(
            selector || `${prop}: ${value}`
          );

          if (parsedProp?.propName === undefined) {
            return;
          }

          const propNamespace = parsedProp.propName.value;

          if (!warningCandidates.has(propNamespace)) {
            warningCandidates.set(propNamespace, []);
          }

          warningCandidates.get(propNamespace).push({
            node: child,
            nested: true
          });
        });

        for (const [namespaceName, candidates] of warningCandidates) {
          const hasMultipleProps = candidates.length > 1;

          for (const candidate of candidates) {
            if (candidate.nested) {
              // If except: "only-of-namespace" and only one child inside nested prop - warn (reverse "always")
              if (
                !exceptIfOnlyOfNamespace ||
                candidate.node.nodes?.length !== 1
              ) {
                continue;
              }

              utils.report({
                message: messages.rejected(namespaceName),
                node: candidate.node,
                result,
                ruleName,
                word: namespaceName
              });

              continue;
            }

            // Don't warn on non-nested namespaced props if there are
            // less than 2 of them and except: "only-of-namespace" is set
            if (exceptIfOnlyOfNamespace && !hasMultipleProps) {
              continue;
            }

            utils.report({
              message: messages.expected(candidate.node.prop),
              node: candidate.node,
              result,
              ruleName,
              word: candidate.node.prop
            });
          }
        }
      });
    } else if (primary === "never") {
      root.walk(node => {
        // postcss-scss parses `prop: value { nested }` as a Declaration with isNested: true
        if (node.type === "decl" && node.isNested) {
          utils.report({
            message: messages.rejected(node.prop),
            result,
            ruleName,
            node,
            word: node.prop
          });

          return;
        }

        if (node.type !== "rule") {
          return;
        }

        const parsedProp = parseNestedPropRoot(node.selector);

        if (parsedProp?.propName === undefined) {
          return;
        }

        utils.report({
          message: messages.rejected(parsedProp.propName.value),
          result,
          ruleName,
          node,
          word: parsedProp.propName.value
        });
      });
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
