import {
  declarationValueIndex,
  namespace,
  whitespaceChecker
} from "../../utils";
import { utils } from "stylelint";

export const ruleName = namespace("dollar-variable-colon-space-after");

export const messages = utils.ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after ":"',
  rejectedAfter: () => 'Unexpected whitespace after ":"',
  expectedAfterSingleLine: () =>
    'Expected single space after ":" with a single-line value'
});

export default function(expectation) {
  const checker = whitespaceChecker("space", expectation, messages);
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["always", "never", "always-single-line", "at-least-one-space"]
    });
    if (!validOptions) {
      return;
    }

    variableColonSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName
    });
  };
}

export function variableColonSpaceChecker({
  locationChecker,
  root,
  result,
  checkedRuleName
}) {
  root.walkDecls(decl => {
    if (decl.prop === undefined || decl.prop[0] !== "$") {
      return;
    }

    // Get the raw $var, and only that
    const endOfPropIndex =
      declarationValueIndex(decl) + decl.raw("between").length - 1;
    // `$var:`, `$var :`
    const propPlusColon = decl.toString().slice(0, endOfPropIndex);

    for (let i = 0; i < propPlusColon.length; i++) {
      if (propPlusColon[i] !== ":") {
        continue;
      }
      locationChecker({
        source: propPlusColon,
        index: i,
        lineCheckStr: decl.value,
        err: m => {
          utils.report({
            message: m,
            node: decl,
            index: i,
            result,
            ruleName: checkedRuleName
          });
        }
      });
      break;
    }
  });
}
