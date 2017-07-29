import isStandardSyntaxRule from "stylelint/lib/utils/isStandardSyntaxRule";

/**
 * Check whether a rule is standard
 *
 * @param {Rule} postcss rule node
 * @return {boolean} If `true`, the rule is standard
 */
export default function(rule) {
  return isStandardSyntaxRule(rule);
}
