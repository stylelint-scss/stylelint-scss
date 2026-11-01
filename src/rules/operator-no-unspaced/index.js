import atRuleParamIndex from "../../utils/atRuleParamIndex.js";
import declarationValueIndex from "../../utils/declarationValueIndex.js";
import eachRoot from "../../utils/eachRoot.js";
import findCommentsInRaws from "../../utils/findCommentsInRaws.js";
import findOperators from "../../utils/sassValueParser/index.js";
import isWhitespace from "../../utils/isWhitespace.js";
import mediaQueryParserModule from "postcss-media-query-parser";
import namespace from "../../utils/namespace.js";
import ruleUrl from "../../utils/ruleUrl.js";
import stylelint from "stylelint";

/** @import { Node, Root } from "postcss" */
/** @import { PostcssResult } from "stylelint" */
/** @import { SassOperator } from "../../utils/sassValueParser/index.js" */

/**
 * @typedef {object} OperatorSource
 * @property {string} source - the string the operators were found in
 * @property {Array<SassOperator>} operators
 */

/**
 * @typedef {object} OperatorCheck
 * @property {string} string - the input string (suspected operation)
 * @property {number} globalIndex - the string's index in a global input
 * @property {number} startIndex - the start index of a symbol to inspect
 * @property {number} endIndex - the end index of a symbol to inspect
 *   (two indexes needed to allow for `==`, `!=`, etc.)
 * @property {Node} node - for stylelint.utils.report
 * @property {PostcssResult} result - for stylelint.utils.report
 */

const { utils } = stylelint;
const mediaQueryParser =
  mediaQueryParserModule.default || mediaQueryParserModule;

const ruleName = namespace("operator-no-unspaced");

const messages = utils.ruleMessages(ruleName, {
  expectedAfter: operator => `Expected single space after "${operator}"`,
  expectedBefore: operator => `Expected single space before "${operator}"`
});

const meta = {
  url: ruleUrl(ruleName)
};

const ignoredAtRules = new Set([
  "forward",
  "use",
  "at-root",
  "scope",
  // Tailwind directives: https://tailwindcss.com/docs/functions-and-directives#directives
  "apply",
  "custom-variant",
  "reference",
  "source",
  "theme",
  "utility",
  "variant"
]);

/**
 * The actual check for are there (un)necessary whitespaces
 */
function checkSpaces({
  string,
  globalIndex,
  startIndex,
  endIndex,
  node,
  result
}) {
  const symbol = string.substring(startIndex, endIndex + 1);

  const beforeOk =
    (string[startIndex - 1] === " " && !isWhitespace(string[startIndex - 2])) ||
    newlineBefore(string, startIndex - 1);

  if (!beforeOk) {
    const reportIndex = globalIndex + startIndex;

    utils.report({
      ruleName,
      result,
      node,
      message: messages.expectedBefore(symbol),
      index: reportIndex,
      endIndex: reportIndex + symbol.length
    });
  }

  const afterOk =
    (string[endIndex + 1] === " " && !isWhitespace(string[endIndex + 2])) ||
    string[endIndex + 1] === "\n" ||
    string.substr(endIndex + 1, 2) === "\r\n";

  if (!afterOk) {
    const index = globalIndex + startIndex;

    utils.report({
      ruleName,
      result,
      node,
      message: messages.expectedAfter(symbol),
      index,
      endIndex: index + symbol.length
    });
  }
}

function newlineBefore(str, startIndex) {
  let index = startIndex;

  while (index && isWhitespace(str[index])) {
    if (str[index] === "\n") return true;

    index--;
  }

  return false;
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

    function checkRoot(rootNode) {
      const rootString = rootNode.source.input.css;

      if (rootString.trim() === "") {
        return;
      }

      calculationOperatorSpaceChecker({
        root: rootNode,
        result,
        checker: checkSpaces
      });
    }
  };
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

/**
 * The core rule logic function. This one can be imported by some other rules
 * that work with Sass operators
 *
 * @param {object} args -- Named arguments object
 * @param {Root} args.root
 * @param {PostcssResult} args.result
 * @param {(check: OperatorCheck) => void} args.checker -- run against all the
 *    operators found in the input
 */
export function calculationOperatorSpaceChecker({ root, result, checker }) {
  /**
   * Takes a string, finds all occurrences of Sass interpolation in it, then
   * finds all operators inside that interpolation
   *
   * @param {string} string
   * @param {number} [startIndex]
   * @return {Array<OperatorSource>} the operators of each Sass interpolation occurrence
   */
  function findInterpolation(string, startIndex) {
    const interpolationRegex = /#\{(.*?)\}/g;
    const results = [];
    // Searching for interpolation
    let match = interpolationRegex.exec(string);

    startIndex = !isNaN(startIndex) ? Number(startIndex) : 0;
    while (match !== null) {
      results.push({
        source: match[0],
        operators: findOperators({
          string: match[0],
          globalIndex: match.index + startIndex
        })
      });
      match = interpolationRegex.exec(string);
    }

    return results;
  }

  /**
   * Runs the checker on every operator found in the strings
   *
   * @param {Array<OperatorSource>} results
   * @param {Node} node
   * @param {number} [offset]
   */
  function checkOperators(results, node, offset = 0) {
    for (const { source, operators } of results) {
      for (const operator of operators) {
        checker({
          string: source,
          globalIndex: operator.globalIndex + offset,
          startIndex: operator.startIndex,
          endIndex: operator.endIndex,
          node,
          result
        });
      }
    }
  }

  const dataURIRegex = /url\(\s*['"]?data:/;

  root.walk(item => {
    if (item.type === "decl") {
      if (item.prop === "unicode-range" || dataURIRegex.test(item.value)) {
        return;
      }

      checkOperators(
        [
          // Value (`10px` in `width: 10px;`)
          {
            source: item.value,
            operators: findOperators({
              string: item.value,
              globalIndex: declarationValueIndex(item),
              // For Sass variable values some special rules apply
              isAfterColon: item.prop[0] === "$"
            })
          },
          // Property name
          ...findInterpolation(item.prop)
        ],
        item
      );

      return;
    }

    if (item.type === "rule") {
      checkOperators(findInterpolation(item.selector), item);

      return;
    }

    if (item.type !== "atrule" || ignoredAtRules.has(item.name)) {
      return;
    }

    if (item.name !== "media" && item.name !== "import") {
      // Function and mixin definitions and other rules
      checkOperators(
        [
          {
            source: item.params,
            operators: findOperators({
              string: item.params,
              globalIndex: atRuleParamIndex(item),
              isAfterColon: true
            })
          }
        ],
        item
      );

      return;
    }

    const results = [];
    const paramIndex = atRuleParamIndex(item);

    mediaQueryParser(item.params).walk(node => {
      const globalIndex = paramIndex + node.sourceIndex;

      if (["keyword", "media-type", "media-feature"].includes(node.type)) {
        results.push(...findInterpolation(node.value, globalIndex));

        return;
      }

      if (node.type === "url") {
        // The argument to the url function is only parsed as SassScript if it is a quoted
        // string, or a _valid_ unquoted URL [1].
        //
        // [1] https://sass-lang.com/documentation/syntax/special-functions#url
        const isQuoted = node.value[0] === '"' || node.value[0] === "'";
        const containsWhitespace = node.value.search(/\s/) > -1;

        if (!isQuoted && !containsWhitespace) {
          return;
        }
      } else if (node.type !== "value") {
        return;
      }

      results.push({
        source: node.value,
        operators: findOperators({
          string: node.value,
          globalIndex,
          isAfterColon: true
        })
      });
    });

    checkOperators(results, item);
  });

  // Checking interpolation inside comments
  // We have to give up on PostCSS here because it skips some inline comments
  for (const comment of findCommentsInRaws(root.source.input.css)) {
    if (comment.type !== "css") {
      continue;
    }

    const startIndex =
      comment.source.start +
      comment.raws.startToken.length +
      comment.raws.left.length;

    checkOperators(findInterpolation(comment.text), root, startIndex);
  }
}

export default rule;
