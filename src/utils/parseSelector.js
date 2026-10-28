import postCssSelectorParser from "postcss-selector-parser";

/**
 * @param {string} selector
 * @param {import('stylelint').PostcssResult} result
 * @param {import('postcss').Node} node
 * @param {import('postcss-selector-parser').SyncProcessor} cb
 */
export default function parseSelector(selector, result, node, cb) {
  try {
    return postCssSelectorParser(cb).processSync(selector);
  } catch {
    result.warn("Cannot parse selector", { node, stylelintType: "parseError" });
  }
}
