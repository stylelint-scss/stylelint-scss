import { utils } from "stylelint"
import {
  namespace,
  isWhitespace,
} from "../../utils"

export const ruleName = namespace("operator-no-newline-after")

export const messages = utils.ruleMessages(ruleName, {
  rejected: (operator) => `Unexpected newline after "${operator}"`,
})

import { calculationOperatorSpaceChecker } from "../operator-no-unspaced"

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
  const symbol = string.substring(startIndex, endIndex + 1)
  let newLineBefore = false

  let index = endIndex + 1
  while (index && isWhitespace(string[index])) {
    if (string[index] === "\n") {
      newLineBefore = true
      break
    }
    index++
  }  

  if (newLineBefore) {
    utils.report({
      ruleName,
      result,
      node,
      message: messages.rejected(symbol),
      index: endIndex + globalIndex,
    })
  }
}

export default function (expectation) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: expectation,
    })
    if (!validOptions) { return }

    calculationOperatorSpaceChecker({
      root,
      result,
      checker: checkNewlineBefore,
    })
  }
}
