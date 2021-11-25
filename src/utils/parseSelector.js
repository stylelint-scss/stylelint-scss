import postCssSelectorParser from "postcss-selector-parser";

export default function(selector, result, node, cb) {
  try {
    postCssSelectorParser(cb).processSync(selector);
  } catch (e) {
    result.warn("Cannot parse selector", { node });
  }
}
