/**
 * Get an at rule's base name
 *
 * @param {import('postcss').AtRule} atRule
 * @return {string} The name
 */
export default function atRuleBaseName(atRule) {
  return atRule.params.replace(/\([^)]*\)/, "").trim();
}
