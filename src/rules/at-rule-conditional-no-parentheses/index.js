import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

const { utils } = stylelint;

const ruleName = namespace("at-rule-conditional-no-parentheses");

const messages = utils.ruleMessages(ruleName, {
  rejected: "Unexpected () used to surround statements for @-rules"
});

const meta = {
  url: ruleUrl(ruleName),
  fixable: true
};

// postcss picks up else-if as else.
const conditional_rules = ["if", "while", "else"];

const regexes = {
  outerParens: /^\(.*\)$/,
  logicalKeyword: /^(and|or|not)\s+/i,
  elseIf: /^if ?/
};

function hasOuterParens(params, startIndex = 0) {
  const trimmed = params.substring(startIndex).trim();

  return trimmed.startsWith("(") && regexes.outerParens.test(trimmed);
}

function stripOuterParens(str) {
  return str.slice(1, -1).trim();
}

function processLogicalExpression(str) {
  const keywordMatch = str.match(regexes.logicalKeyword);

  if (!keywordMatch) {
    return str;
  }

  const keyword = keywordMatch[0];
  const afterKeyword = str.slice(keyword.length).trim();

  // Keyword followed by outer parens - remove them
  if (regexes.outerParens.test(afterKeyword)) {
    return `${keyword}${stripOuterParens(afterKeyword)}`;
  }

  // Continue processing remaining content
  return `${keyword}${processLogicalExpression(afterKeyword)}`;
}

function removeOuterParens(str) {
  const trimmed = str.trim();

  if (!regexes.outerParens.test(trimmed)) {
    return str;
  }

  let depth = 0;
  let endIndex = 0;

  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === "(") depth++;
    else if (trimmed[i] === ")") depth--;

    if (depth === 0) {
      endIndex = i;
      break;
    }
  }

  // Content inside the outer parens: "(contentInside) contentAfter"
  const contentInside = trimmed.substring(1, endIndex).trim();
  // Content after the closing paren
  const contentAfter = trimmed.substring(endIndex + 1).trim();

  if (!contentAfter) {
    return contentInside;
  }

  return `${contentInside} ${processLogicalExpression(contentAfter)}`;
}

function report(atrule, result, fix) {
  utils.report({
    message: messages.rejected,
    node: atrule,
    result,
    ruleName,
    word: atrule.params.replace(/\bif\b/, ""), // Remove 'if' from '@else if'.
    fix
  });
}

function rule(primary) {
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

      const fix = () => {
        let startIndex = 0;
        let prefix = "";

        if (atrule.name === "else") {
          const ifMatch = atrule.params.match(regexes.elseIf);

          if (ifMatch) {
            prefix = "if ";
            startIndex = ifMatch[0].length;
          }
        }

        if (atrule.name !== "else") {
          atrule.raws.afterName = " ";
        }

        atrule.params =
          prefix + removeOuterParens(atrule.params.substring(startIndex));
      };

      if (atrule.name === "else") {
        const ifMatch = atrule.params.match(regexes.elseIf);

        if (ifMatch && hasOuterParens(atrule.params, ifMatch[0].length)) {
          report(atrule, result, fix);
        }
      } else if (hasOuterParens(atrule.params, 0)) {
        report(atrule, result, fix);
      }
    });
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
