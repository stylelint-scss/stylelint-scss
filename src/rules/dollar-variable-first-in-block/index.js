import {
  namespace,
  optionsHaveException,
  optionsHaveIgnored
} from "../../utils";
import { utils } from "stylelint";
import { includes } from "lodash";

export const ruleName = namespace("dollar-variable-first-in-block");

export const messages = utils.ruleMessages(ruleName, {
  expected: "Expected $-variable to be first in block"
});

export default function(primary, options) {
  return (root, result) => {
    const validOptions = utils.validateOptions(
      result,
      ruleName,
      {
        actual: primary
      },
      {
        actual: options,
        possible: {
          ignore: ["comments", "imports"],
          except: ["root", "at-rule", "function", "mixin", "if-else", "loops"]
        },
        optional: true
      }
    );

    if (!validOptions) {
      return;
    }

    const isDollarVar = node => node.prop && node.prop[0] === "$";

    root.walkDecls(decl => {
      // Ignore declarations that aren't variables.
      // ------------------------------------------
      if (!isDollarVar(decl)) {
        return;
      }

      // If selected, ignore declarations in root.
      // -----------------------------------------
      if (optionsHaveException(options, "root") && decl.parent === root) {
        return;
      }

      // If selected, ignore declarations in different types of at-rules.
      // ----------------------------------------------------------------
      if (decl.parent.type === "atrule") {
        if (
          optionsHaveException(options, "at-rule") ||
          (optionsHaveException(options, "function") &&
            decl.parent.name === "function") ||
          (optionsHaveException(options, "mixin") &&
            decl.parent.name === "mixin") ||
          (optionsHaveException(options, "if-else") &&
            (decl.parent.name === "if" || decl.parent.name === "else")) ||
          (optionsHaveException(options, "loops") &&
            (decl.parent.name === "each" ||
              decl.parent.name === "for" ||
              decl.parent.name === "while"))
        ) {
          return;
        }
      }

      const previous = decl.prev();

      // If first or preceded by another variable.
      // -----------------------------------------
      if (!previous || isDollarVar(previous)) {
        return;
      }

      // Check if preceded only by allowed types.
      // ----------------------------------------
      let precededOnlyByAllowed = true;
      const allowComments = optionsHaveIgnored(options, "comments");
      const allowImports = optionsHaveIgnored(options, "imports");
      const importAtRules = ["import", "use", "forward"];

      for (const sibling of decl.parent.nodes) {
        if (sibling === decl) {
          break;
        } else if (
          !isDollarVar(sibling) &&
          !(
            (allowComments && sibling.type === "comment") ||
            (allowImports &&
              sibling.type === "atrule" &&
              includes(importAtRules, sibling.name))
          )
        ) {
          precededOnlyByAllowed = false;
        }
      }

      if (precededOnlyByAllowed) {
        return;
      }

      utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName
      });
    });
  };
}
