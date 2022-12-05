import beforeBlockString from "./beforeBlockString";
import hasBlock from "./hasBlock";
import rawNodeString from "./rawNodeString";

/**
 * Return a CSS statement's block -- the string that starts with `{` and ends with `}`.
 *
 * If the statement has no block (e.g. `@import url(foo.css);`),
 * return undefined.
 *
 * @param {Rule|AtRule} statement - postcss rule or at-rule node
 * @return {string|undefined}
 */
export default function (statement) {
  if (!hasBlock(statement)) {
    return;
  }

  return rawNodeString(statement).slice(beforeBlockString(statement).length);
}
