/**
 * Parses a media query list into an array of nodes. A typical node signature:
 *  {string} node.type -- one of: "media-query", "media-type", "keyword",
 *    "media-feature-expression", "media-feature", "value"
 *  {string} node.value -- the contents of a particular element, trimmed
 *    e.g.: `screen`, `max-width`, `1024px`
 *  {string} node.after -- whitespaces that follow the element
 *  {string} node.before -- whitespaces that precede the element
 *  {string} node.sourceIndex -- the index of the element in a source media
 *    query list, 0-based
 *
 * Some nodes (media queries, media feature expressions) contain other nodes.
 * They additionally have:
 *  {array} node.nodes -- an array of nodes of the type described here
 *  {funciton} node.each -- traverses direct children of the node, calling
 *    a callback for each one
 *  {funciton} node.walk -- traverses ALL descendants of the node, calling
 *    a callback for each one
 */

import Container from "./nodes/Container"

import { parseMediaList } from "./parsers"

export default function parseMedia(value) {
  return new Container({
    nodes: parseMediaList(value),
  })
}
