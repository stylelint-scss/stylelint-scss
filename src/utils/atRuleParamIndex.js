/**
 * Get the index of a media query's params
 *
 * @param {import('postcss').AtRule} atRule
 * @return {number} The index
 */
export default function atRuleParamIndex(atRule) {
  // Initial 1 is for the `@`
  let index = 1 + atRule.name.length;

  if (atRule.raw("afterName")) {
    index += atRule.raw("afterName").length;
  }

  return index;
}
