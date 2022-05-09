import { utils } from "stylelint";
import { namespace, ruleUrl } from "../../utils";

export const ruleName = namespace("at-rule-conditional-no-parentheses");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected () used to surround statements for @-rules"
});

export const meta = {
  url: ruleUrl(ruleName)
};

// postcss picks up else-if as else.
const conditional_rules = ["if", "while", "else"];

function report(atrule, result) {
  utils.report({
    message: messages.rejected,
    node: atrule,
    result,
    ruleName
  });
}

function fix(atrule) {
  const regex = /(if)? ?\((.*)\)/;

  // 2 regex groups: 'if ' and cond.
  const groups = atrule.params.match(regex).slice(1);

  atrule.params = [...new Set(groups)].join(" ");
}

export default function rule(primary, _unused, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules(atrule => {
      // Check if this is a conditional rule.
      if (!conditional_rules.includes(atrule.name)) {
        return;
      }

      // Else uses a different regex
      // params are of format "`if (cond)` or `if cond`
      // instead of `(cond)` or `cond`"
      if (atrule.name === "else") {
        if (atrule.params.match(/ ?if ?\(.*\) ?$/)) {
          if (context.fix) {
            fix(atrule);
          } else {
            report(atrule, result);
          }
        }
      } else {
        if (atrule.params.trim().match(/^\(.*\)$/)) {
          if (context.fix) {
            fix(atrule);
          } else {
            report(atrule, result);
          }
        }
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
