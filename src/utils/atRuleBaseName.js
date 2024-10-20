/**
 * Get an at rule's base name
 *
 * @param {AtRule} atRule
 * @return {string} The name
 */
export default function atRuleBaseName(atRule) {
  return atRule.params.replace(/\([^)]*\)/, "").trim();
}
