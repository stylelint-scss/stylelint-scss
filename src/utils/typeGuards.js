/** @import { AtRule, Comment, Declaration, Document, Node, Root, Rule, Source as NodeSource } from "postcss" */

/**
 * @param {Node} node
 * @returns {node is Root}
 */
export function isRoot(node) {
  return node.type === "root";
}

/**
 * @param {Node} node
 * @returns {node is Rule}
 */
export function isRule(node) {
  return node.type === "rule";
}

/**
 * @param {Node} node
 * @returns {node is AtRule}
 */
export function isAtRule(node) {
  return node.type === "atrule";
}

/**
 * @param {Node} node
 * @returns {node is Comment}
 */
export function isComment(node) {
  return node.type === "comment";
}

/**
 * @param {Node} node
 * @returns {node is Declaration}
 */
export function isDeclaration(node) {
  return node.type === "decl";
}

/**
 * @param {Node} node
 * @returns {node is Document}
 */
export function isDocument(node) {
  return node.type === "document";
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').DivNode}
 */
export function isValueDiv(node) {
  return node.type === "div";
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').FunctionNode}
 */
export function isValueFunction(node) {
  return node.type === "function";
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').SpaceNode}
 */
export function isValueSpace(node) {
  return node.type === "space";
}

/**
 * @param {import('postcss-value-parser').Node} node
 * @returns {node is import('postcss-value-parser').WordNode}
 */
export function isValueWord(node) {
  return node.type === "word";
}

/**
 * @param {Node} node
 * @returns {node is (Node & {source: NodeSource})}
 */
export function hasSource(node) {
  return Boolean(node.source);
}
