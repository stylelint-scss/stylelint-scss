import stylelint from "stylelint";
import eachRoot from "../../utils/eachRoot.js";
import isWhitespace from "../../utils/isWhitespace.js";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import { calculationOperatorSpaceChecker } from "../operator-no-unspaced/index.js";

const { utils } = stylelint;

const ruleName = namespace("operator-no-newline-after");

const messages = utils.ruleMessages(ruleName, {
  rejected: operator => `Unexpected newline after "${operator}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

/**
 * The checker function: whether there is a newline before THAT operator.
 */
function checkNewlineBefore({
  string,
  globalIndex,
  startIndex,
  endIndex,
  node,
  result
}) {
  const symbol = string.substring(startIndex, endIndex + 1);
  let newLineBefore = false;

  let index = endIndex + 1;

  while (index && isWhitespace(string[index])) {
    if (string[index] === "\n") {
      newLineBefore = true;
      break;
    }

    index++;
  }

  if (newLineBefore) {
    const index = globalIndex + startIndex;
    utils.report({
      ruleName,
      result,
      node,
      message: messages.rejected(symbol),
      index,
      endIndex: index + symbol.length
    });
  }
}

function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation
    });

    if (!validOptions) {
      return;
    }

    eachRoot(root, checkRoot);

    function checkRoot(root) {
      calculationOperatorSpaceChecker({
        root,
        result,
        checker: checkNewlineBefore
      });
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default rule;
