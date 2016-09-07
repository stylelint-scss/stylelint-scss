import rule, { ruleName, messages } from "../"
import testRule from "stylelint-test-rule-tape"

import postcss from "postcss"
import test from "tape"

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}

// --------------------------------------------------------------------------
// always
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [ {
    code: `
      .funky {
        background: no-repeat;
        margin: 1px;
      }
    `,
    description: "{ always } Nothing to nest",
  }, {
    code: `
      .funky {
        -webkit-box-sizing: border-box;
        -webkit-box-shadow: 1px 0 0 red;
      }
    `,
    description: "{ always } Vendor prefixed rules.",
  } ],
})

test("{ always } Simple test: background-color, background-repeat", t => {
  t.plan(5)
  postcss([rule("always")])
    .process(`
      a {
        background-color: red;
        background-repeat: no-repeat;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 2, "Number of props reported")
      t.equal(warnings[0].text, messages.expected("background-color"), "Message (+prop name)")
      t.equal(warnings[0].line, 3, "Line number")
      t.equal(warnings[0].column, 9, "Column")
      t.equal(warnings[1].text, messages.expected("background-repeat"), "Message (+prop name)")
    })
    .catch(logError)
})

test("{ always } background-color, background-repeat separated by at-rule", t => {
  t.plan(6)
  postcss([rule("always")])
    .process(`
      a {
        background-color: red;
        @media (color) { background-image: url(img.png); }
        background-repeat: no-repeat;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 3, "Number of props reported")
      t.equal(warnings[0].text, messages.expected("background-color"), "Message (+prop name)")
      t.equal(warnings[0].line, 3, "Line number")
      t.equal(warnings[0].column, 9, "Column")
      t.equal(warnings[1].text, messages.expected("background-repeat"), "Message (+prop name)")
      t.equal(warnings[2].text, messages.expected("background-image"), "Reporting bgi inside @media")
    })
    .catch(logError)
})

// Nested stuff

test("{ always } one `background` in nested form", t => {
  t.plan(1)
  postcss([rule("always")])
    .process(`
      a {
        background: {
          color: red
        };
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "Should not warn (already nested).")
    })
    .catch(logError)
})

test("{ always } nested `background` and background-position", t => {
  t.plan(1)
  postcss([rule("always")])
    .process(`
      a {
        background: url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 1, "Warn only bgp")
    })
    .catch(logError)
})

test("{ always } `prop:    value {nested} prop-v: value`.", t => {
  t.plan(1)
  postcss([rule("always")])
    .process(`
      a {
        background:   url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 1, "Warn only bgp")
    })
    .catch(logError)
})

test("{ always } `prop  :  value {nested} prop-v: value`.", t => {
  t.plan(1)
  postcss([rule("always")])
    .process(`
      a {
        background  : url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 1, "Warn only bgp")
    })
    .catch(logError)
})

// --------------------------------------------------------------------------
// always, except: only-of-namespace
// --------------------------------------------------------------------------

test("{ always, except: only-of-namespace } background-color only", t => {
  t.plan(1)
  postcss([rule("always", { except: "only-of-namespace" })])
    .process(`
      a {
        position: absolute;
        background-color: red;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "Number of props reported")
    })
    .catch(logError)
})

test("{ always, except: only-of-namespace } background-color, background-repeat separated by at-rule", t => {
  t.plan(5)
  postcss([rule("always", { except: "only-of-namespace" })])
    .process(`
      a {
        background-color: red;
        @media (color) { background-image: url(img.png); }
        background-repeat: no-repeat;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 2, "Number of props reported")
      t.equal(warnings[0].text, messages.expected("background-color"), "Message (+prop name)")
      t.equal(warnings[0].line, 3, "Line number")
      t.equal(warnings[0].column, 9, "Column")
      t.equal(warnings[1].text, messages.expected("background-repeat"), "Message (+prop name)")
    })
    .catch(logError)
})

// With some nested rules

test("{ always, except: only-of-namespace } `background:red`, one rule inside", t => {
  t.plan(1)
  postcss([rule("always", { except: "only-of-namespace" })])
    .process(`
      a {
        background:red {
          origin: padding-box;
        }
        background-position: center;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "No warning: `background:red` is considered a selector, and bgr is alone then")
    })
    .catch(logError)
})

test("{ always, except: only-of-namespace } background, two rules inside", t => {
  t.plan(1)
  postcss([rule("always", { except: "only-of-namespace" })])
    .process(`
      a {
        background: red {
          origin: padding-box;
          repeat: no-repeat;
        }
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0)
    })
    .catch(logError)
})

test("{ always, except: only-of-namespace } `background:red`, one rule inside", t => {
  t.plan(2)
  postcss([rule("always", { except: "only-of-namespace" })])
    .process(`
      a {
        background: red {
          origin: padding-box;
          repeat: repeat-x;
        }
        background-position: center;
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 1)
      t.equal(warnings[0].line, 7)
    })
    .catch(logError)
})

test("{ always, except: only-of-namespace } `prop: value`, one rule inside", t => {
  t.plan(2)
  postcss([rule("always", { except: "only-of-namespace" })])
    .process(`
      a {
        background: red {
          origin: padding-box;
        }
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 1, "One warning for bg")
      t.equal(warnings[0].text, messages.rejected("background"))
    })
    .catch(logError)
})

test("{ always, except: only-of-namespace } `prop:`, one rule X2", t => {
  t.plan(5)
  postcss([rule("always", { except: "only-of-namespace" })])
    .process(`
      a {
        background: {
          origin: padding-box;
        }
        background: {
          color: red;
        }
      }
    `)
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 2)
      t.equal(warnings[0].text, messages.rejected("background"))
      t.equal(warnings[0].line, 3)
      t.equal(warnings[1].text, messages.rejected("background"))
      t.equal(warnings[1].line, 6)
    })
    .catch(logError)
})

// --------------------------------------------------------------------------
// never
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [ {
    code: `
      a {
        background: red;
      }
    `,
    description: "{ never } bg shorthand.",
  }, {
    code: `
      a {
        background-color: red;
      }
    `,
    description: "{ never } bgc.",
  }, {
    code: `
      a {
        background-color: red;
        background-repeat: no-repeat;
      }
    `,
    description: "{ never } bgc, bgr.",
  }, {
    code: `
      a {
        background:red {
          repeat: no-repeat;
          origin: padding-box;
        }
      }
    `,
    description: "{ never } `prop:value` -- selector.",
  } ],

  reject: [ {
    code: `
      a {
        background: red {
          repeat: no-repeat;
        }
      }
    `,
    description: "{ never } `prop: { one nested }`.",
    message: messages.rejected("background"),
    line: 3,
    column: 9,
  }, {
    code: `
      a {
        background: {
          repeat: no-repeat;
        }
      }
    `,
    description: "{ never } `prop: value { one nested }`.",
    message: messages.rejected("background"),
    line: 3,
    column: 9,
  }, {
    code: `
      a {
        b {
          @media (color) {
            background: {
              repeat: no-repeat;
              color: red;
            }
          }
        }
      }
    `,
    description: "{ never } `prop: { two nested }`, deep inside a rule.",
    message: messages.rejected("background"),
    line: 5,
    column: 13,
  }, {
    code: `
      a {
        -webkit: {
          box-sizing: border-box;
          box-shadow: 1px 0 0 red;
        }
      }
    `,
    description: "{ never } `-webkit: { ... }`.",
    message: messages.rejected("-webkit"),
    line: 3,
    column: 9,
  } ],
})
