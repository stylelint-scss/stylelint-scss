import { utils } from "stylelint";
import { eachRoot, namespace, isWhitespace, ruleUrl } from "../../utils";
import { calculationOperatorSpaceChecker } from "../operator-no-unspaced";

export const ruleName = namespace("operator-no-newline-after");

export const messages = utils.ruleMessages(ruleName, {
  rejected: (operator) => `Unexpected newline after "${operator}"`,
});

export const meta = {
  url: ruleUrl(ruleName),
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
  result,
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
    utils.report({
      ruleName,
      result,
      node,
      message: messages.rejected(symbol),
      index: endIndex + globalIndex,
    });
  }
}

export default function rule(expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
    });

    if (!validOptions) {
      return;
    }

    eachRoot(root, checkRoot);

    function checkRoot(root) {
      calculationOperatorSpaceChecker({
        root,
        result,
        checker: checkNewlineBefore,
      });
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
