import postCssSelectorParser from "postcss-selector-parser";

export default function parseSelector(selector, result, node, cb) {
  try {
    return postCssSelectorParser(cb).processSync(selector);
  } catch {
    result.warn("Cannot parse selector", { node, stylelintType: "parseError" });
  }
}
