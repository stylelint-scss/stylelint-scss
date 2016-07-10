import test from "tape"
import { parseMedia } from "../utils"

test("`only screen and (color)`.", t => {
  t.plan(3)
  
  const result = parseMedia("only screen and (color)")
  
  t.equal(result.nodes.length, 1, "The number of media queries.")
  t.equal(result.nodes[0].nodes.length, 4, "The number of elements in a MQ.")
  t.deepEqual(result.nodes[0], {
    after: "",
    before: "",
    type: "media-query",
    value: "only screen and (color)",
    sourceIndex: 0,
    nodes: [ {
      after: " ",
      before: "",
      type: "keyword",
      value: "only",
      sourceIndex: 0,
    }, {
      after: " ",
      before: " ",
      type: "media-type",
      value: "screen",
      sourceIndex: 5,
    }, {
      after: " ",
      before: " ",
      type: "keyword",
      value: "and",
      sourceIndex: 12,
    }, {
      after: "",
      before: " ",
      type: "media-feature-expression",
      value: "(color)",
      sourceIndex: 16,
      nodes: [{
        after: "",
        before: "",
        type: "media-feature",
        value: "color",
        sourceIndex: 17,
      }],
    } ],
  }, "The structure of an MQ node.")
})

test("`not tv and (min-width: 10px)`.", t => {
  t.plan(3)
  
  const result = parseMedia("not tv and (min-width: 10px)")
  
  t.equal(result.nodes.length, 1, "The number of media queries.")
  t.equal(result.nodes[0].nodes.length, 4, "The number of elements in a MQ.")
  t.deepEqual(result.nodes[0], {
    after: "",
    before: "",
    type: "media-query",
    value: "not tv and (min-width: 10px)",
    sourceIndex: 0,
    nodes: [ {
      after: " ",
      before: "",
      type: "keyword",
      value: "not",
      sourceIndex: 0,
    }, {
      after: " ",
      before: " ",
      type: "media-type",
      value: "tv",
      sourceIndex: 4,
    }, {
      after: " ",
      before: " ",
      type: "keyword",
      value: "and",
      sourceIndex: 7,
    }, {
      after: "",
      before: " ",
      type: "media-feature-expression",
      value: "(min-width: 10px)",
      sourceIndex: 11,
      nodes: [ {
        after: "",
        before: "",
        type: "media-feature",
        value: "min-width",
        sourceIndex: 12,
      }, {
        after: "",
        before: " ",
        type: "value",
        value: "10px",
        sourceIndex: 23,
      } ],
    } ],
  }, "The structure of an MQ node.")
})

test("`not tv, screen, (max-width: $var)`.", t => {
  t.plan(2)
  
  const result = parseMedia("not tv, screen, (max-width: $var)")
  
  t.equal(result.nodes.length, 3, "The number of media queries.")
  t.deepEqual(result.nodes, [ {
    after: "",
    before: "",
    type: "media-query",
    value: "not tv",
    sourceIndex: 0,
    nodes: [ {
      after: " ",
      before: "",
      type: "keyword",
      value: "not",
      sourceIndex: 0,
    }, {
      after: "",
      before: " ",
      type: "media-type",
      value: "tv",
      sourceIndex: 4,
    } ],
  }, {
    after: "",
    before: " ",
    type: "media-query",
    value: "screen",
    sourceIndex: 8,
    nodes: [{
      after: "",
      before: " ",
      type: "media-type",
      value: "screen",
      sourceIndex: 8,
    }],
  }, {
    after: "",
    before: " ",
    type: "media-query",
    value: "(max-width: $var)",
    sourceIndex: 16,
    nodes: [{
      after: "",
      before: " ",
      type: "media-feature-expression",
      value: "(max-width: $var)",
      sourceIndex: 16,
      nodes: [ {
        after: "",
        before: "",
        type: "media-feature",
        value: "max-width",
        sourceIndex: 17,
      }, {
        after: "",
        before: " ",
        type: "value",
        value: "$var",
        sourceIndex: 28,
      } ],
    }],
  } ], "The structure of an MQ node.")
})

// Media query from @import (includes the `url` part)
test("`url(fun()) screen and (color), projection and (color)`.", t => {
  t.plan(2)
  
  const result = parseMedia("url(fun()) screen and (color), projection and (color)")
  
  t.equal(result.nodes.length, 3, "The number of media queries.")
  t.deepEqual(result.nodes, [ {
    after: " ",
    before: "",
    type: "url",
    value: "url(fun())",
    sourceIndex: 0,
  }, {
    after: "",
    before: " ",
    type: "media-query",
    value: "screen and (color)",
    sourceIndex: 11,
    nodes: [ {
      after: " ",
      before: " ",
      type: "media-type",
      value: "screen",
      sourceIndex: 11,
    }, {
      after: " ",
      before: " ",
      type: "keyword",
      value: "and",
      sourceIndex: 18,
    }, {
      after: "",
      before: " ",
      type: "media-feature-expression",
      value: "(color)",
      sourceIndex: 22,
      nodes: [{
        after: "",
        before: "",
        type: "media-feature",
        value: "color",
        sourceIndex: 23,
      }],
    } ],
  }, {
    after: "",
    before: " ",
    type: "media-query",
    value: "projection and (color)",
    sourceIndex: 31,
    nodes: [ {
      after: " ",
      before: " ",
      type: "media-type",
      value: "projection",
      sourceIndex: 31,
    }, {
      after: " ",
      before: " ",
      type: "keyword",
      value: "and",
      sourceIndex: 42,
    }, {
      after: "",
      before: " ",
      type: "media-feature-expression",
      value: "(color)",
      sourceIndex: 46,
      nodes: [{
        after: "",
        before: "",
        type: "media-feature",
        value: "color",
        sourceIndex: 47,
      }],
    } ],
  } ], "The structure of an MQ node.")
})

// Media feature fully consisting of Sass structure, colon inside
test("`( #{'max-width' + ': 10px'} )`.", t => {
  t.plan(2)
  
  const result = parseMedia("( #{'max-width' + ': 10px'} )")
  
  t.equal(result.nodes.length, 1, "The number of media queries.")
  t.deepEqual(result.nodes, [{
    after: "",
    before: "",
    type: "media-query",
    value: "( #{'max-width' + ': 10px'} )",
    sourceIndex: 0,
    nodes: [{
      after: "",
      before: "",
      type: "media-feature-expression",
      value: "( #{'max-width' + ': 10px'} )",
      sourceIndex: 0,
      nodes: [{
        after: " ",
        before: " ",
        type: "media-feature",
        value: "#{'max-width' + ': 10px'}",
        sourceIndex: 2,
      }],
    }],
  }], "The structure of an MQ node.")
})

test("`#{'scree' + 'n'}`.", t => {
  t.plan(2)
  
  const result = parseMedia("#{'scree' + 'n'}")
  
  t.equal(result.nodes.length, 1, "The number of media queries.")
  t.deepEqual(result.nodes, [{
    after: "",
    before: "",
    type: "media-query",
    value: "#{'scree' + 'n'}",
    sourceIndex: 0,
    nodes: [{
      after: "",
      before: "",
      type: "media-type",
      value: "#{'scree' + 'n'}",
      sourceIndex: 0,
    }],
  }], "The structure of an MQ node.")
})
