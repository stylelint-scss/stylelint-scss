import {
  hasEmptyLine,
  isSingleLineString,
  namespace,
  optionsHaveException,
  optionsHaveIgnored,
  blockString
} from "../../utils";
import { utils } from "stylelint";
import { isBoolean } from "lodash";

export const ruleName = namespace("dollar-variable-empty-line-before");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected an empty line before $-variable",
  rejected: "Unexpected empty line before $-variable"
});

export default function(expectation, options, context) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: expectation,
        possible: ["always", "never"]
      },
      {
        actual: options,
        possible: {
          except: ["first-nested", "after-comment", "after-dollar-variable"],
          ignore: ["after-comment", "inside-single-line-block"],
          disableFix: isBoolean
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const fix = (decl, match, replace) => {
      decl.raws.before = decl.raws.before.replace(
        new RegExp(`^${match}`),
        replace
      );
    };

    const hasNewline = str => str.includes(context.newline);

    root.walkDecls(decl => {
      if (!isDollarVar(decl)) {
        return;
      }

      // Always ignore the first $var in a stylesheet
      if (decl === root.first) {
        return;
      }

      // If ignoring vars after comments is set
      if (
        optionsHaveIgnored(options, "after-comment") &&
        decl.prev() &&
        decl.prev().type === "comment"
      ) {
        return;
      }

      // If ignoring single-line blocks
      if (
        optionsHaveIgnored(options, "inside-single-line-block") &&
        decl.parent.type !== "root" &&
        isSingleLineString(blockString(decl.parent))
      ) {
        return;
      }

      let expectHasEmptyLineBefore = expectation === "always";

      // Reverse for a variable that is a first child of its parent
      if (
        optionsHaveException(options, "first-nested") &&
        decl === decl.parent.first
      ) {
        expectHasEmptyLineBefore = !expectHasEmptyLineBefore;
      }

      // Reverse if after a comment
      if (
        optionsHaveException(options, "after-comment") &&
        decl.prev() &&
        decl.prev().type === "comment"
      ) {
        expectHasEmptyLineBefore = !expectHasEmptyLineBefore;
      }

      // Reverse if after another $-variable
      if (
        optionsHaveException(options, "after-dollar-variable") &&
        decl.prev() &&
        isDollarVar(decl.prev())
      ) {
        expectHasEmptyLineBefore = !expectHasEmptyLineBefore;
      }

      const before = decl.raws.before;

      if (expectHasEmptyLineBefore === hasEmptyLine(before)) {
        return;
      }

      const isFixDisabled = options && options.disableFix === true;

      if (context.fix && !isFixDisabled) {
        if (expectHasEmptyLineBefore && !hasEmptyLine(before)) {
          fix(decl, context.newline, context.newline + context.newline);

          if (
            optionsHaveException(options, "first-nested") &&
            !hasNewline(before)
          ) {
            fix(decl, "\\s+", context.newline + context.newline);
          }

          return;
        }

        if (!expectHasEmptyLineBefore && hasEmptyLine(before)) {
          fix(decl, "\\n\\r\\n", "\r\n");
          fix(decl, context.newline + context.newline, context.newline);

          return;
        }
      }

      utils.report({
        message: expectHasEmptyLineBefore
          ? messages.expected
          : messages.rejected,
        node: decl,
        result,
        ruleName
      });
    });
  };
}

function isDollarVar(node) {
  return node.prop && node.prop[0] === "$";
}
