import { utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";

export const ruleName = namespace("calc-variable-interpolation");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (n, v) =>
    `Expected variable ${v} to be interpolated when using it with ${n} in calc() function`
});

export const meta = {
  url: ruleUrl(ruleName)
};

export default function rule(actual) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      if (decl.value.includes("calc(")) {
        const regexp = /calc\((?!.*#\{.*)(.*\$[a-zA-Z0-9-_]*.*)\)/g;
        const hasInterpolation = /#\{.*\}/g.test(decl.value);

        let match = null;
        while ((match = regexp.exec(decl.value)) !== null) {
          if (hasInterpolation) {
            continue;
          }

          const sassVarArr = match[1].match(/\$[\w-]+/g);
          const sassVar = sassVarArr[sassVarArr.length - 1];
          const nodeProp = decl.prop;

          utils.report({
            ruleName,
            result,
            node: decl,
            message: messages.rejected(nodeProp, sassVar)
          });
        }
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
