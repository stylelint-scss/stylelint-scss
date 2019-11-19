"use strict";

const postcss = require("postcss");
const { rule, ruleName, messages } = require("..");

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

// --------------------------------------------------------------------------
// always
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      .funky {
        background: no-repeat;
        margin: 1px;
      }
    `,
      description: "{ always } Nothing to nest"
    },
    {
      code: `
      .funky {
        -webkit-box-sizing: border-box;
        -webkit-box-shadow: 1px 0 0 red;
      }
    `,
      description: "{ always } Vendor prefixed rules."
    },
    {
      code: `
      a {
        font: {
          size: 10px;
          weight: 400;
        }
      }
      `,
      description: "nested properties"
    }
  ]
});

test("{ always } Simple test: background-color, background-repeat", () => {
  expect.assertions(5);

  return postcss([rule("always")])
    .process(
      `
      a {
        background-color: red;
        background-repeat: no-repeat;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expected("background-color"));
      expect(warnings[0].line).toBe(3);
      expect(warnings[0].column).toBe(9);
      expect(warnings[1].text).toBe(messages.expected("background-repeat"));
    })
    .catch(logError);
});

test("{ always } background-color, background-repeat separated by at-rule", () => {
  expect.assertions(6);

  return postcss([rule("always")])
    .process(
      `
      a {
        background-color: red;
        @media (color) { background-image: url(img.png); }
        background-repeat: no-repeat;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
      expect(warnings[0].text).toBe(messages.expected("background-color"));
      expect(warnings[0].line).toBe(3);
      expect(warnings[0].column).toBe(9);
      expect(warnings[1].text).toBe(messages.expected("background-repeat"));
      expect(warnings[2].text).toBe(messages.expected("background-image"));
    })
    .catch(logError);
});

// Nested stuff

test("{ always } one `background` in nested form", () => {
  expect.assertions(1);

  return postcss([rule("always")])
    .process(
      `
      a {
        background: {
          color: red
        };
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
    })
    .catch(logError);
});

test("{ always } nested `background` and background-position", () => {
  expect.assertions(1);

  return postcss([rule("always")])
    .process(
      `
      a {
        background: url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
    })
    .catch(logError);
});

test("{ always } `prop:    value {nested} prop-v: value`.", () => {
  expect.assertions(1);

  return postcss([rule("always")])
    .process(
      `
      a {
        background:   url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
    })
    .catch(logError);
});

test("{ always } `prop  :  value {nested} prop-v: value`.", () => {
  expect.assertions(1);

  return postcss([rule("always")])
    .process(
      `
      a {
        background  : url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
    })
    .catch(logError);
});

// --------------------------------------------------------------------------
// always, except: only-of-namespace
// --------------------------------------------------------------------------

test("{ always, except: only-of-namespace } background-color only", () => {
  expect.assertions(1);

  return postcss([rule("always", { except: "only-of-namespace" })])
    .process(
      `
      a {
        position: absolute;
        background-color: red;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
    })
    .catch(logError);
});

test("{ always, except: only-of-namespace } background-color, background-repeat separated by at-rule", () => {
  expect.assertions(5);

  return postcss([rule("always", { except: "only-of-namespace" })])
    .process(
      `
      a {
        background-color: red;
        @media (color) { background-image: url(img.png); }
        background-repeat: no-repeat;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expected("background-color"));
      expect(warnings[0].line).toBe(3);
      expect(warnings[0].column).toBe(9);
      expect(warnings[1].text).toBe(messages.expected("background-repeat"));
    })
    .catch(logError);
});

// With some nested rules

test("{ always, except: only-of-namespace } `background:red`, one rule inside", () => {
  expect.assertions(1);

  return postcss([rule("always", { except: "only-of-namespace" })])
    .process(
      `
      a {
        background:red {
          origin: padding-box;
        }
        background-position: center;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
    })
    .catch(logError);
});

test("{ always, except: only-of-namespace } background, two rules inside", () => {
  expect.assertions(1);

  return postcss([rule("always", { except: "only-of-namespace" })])
    .process(
      `
      a {
        background: red {
          origin: padding-box;
          repeat: no-repeat;
        }
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
    })
    .catch(logError);
});

test("{ always, except: only-of-namespace } `background:red`, one rule inside 2", () => {
  expect.assertions(2);

  return postcss([rule("always", { except: "only-of-namespace" })])
    .process(
      `
      a {
        background: red {
          origin: padding-box;
          repeat: repeat-x;
        }
        background-position: center;
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      expect(warnings[0].line).toBe(7);
    })
    .catch(logError);
});

test("{ always, except: only-of-namespace } `prop: value`, one rule inside", () => {
  expect.assertions(2);

  return postcss([rule("always", { except: "only-of-namespace" })])
    .process(
      `
      a {
        background: red {
          origin: padding-box;
        }
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      expect(warnings[0].text).toBe(messages.rejected("background"));
    })
    .catch(logError);
});

test("{ always, except: only-of-namespace } `prop:`, one rule X2", () => {
  expect.assertions(5);

  return postcss([rule("always", { except: "only-of-namespace" })])
    .process(
      `
      a {
        background: {
          origin: padding-box;
        }
        background: {
          color: red;
        }
      }
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.rejected("background"));
      expect(warnings[0].line).toBe(3);
      expect(warnings[1].text).toBe(messages.rejected("background"));
      expect(warnings[1].line).toBe(6);
    })
    .catch(logError);
});

// --------------------------------------------------------------------------
// never
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      a {
        background: red;
      }
    `,
      description: "{ never } bg shorthand."
    },
    {
      code: `
      a {
        background-color: red;
      }
    `,
      description: "{ never } bgc."
    },
    {
      code: `
      a {
        background-color: red;
        background-repeat: no-repeat;
      }
    `,
      description: "{ never } bgc, bgr."
    },
    {
      code: `
      a {
        background:red {
          repeat: no-repeat;
          origin: padding-box;
        }
      }
    `,
      description: "{ never } `prop:value` -- selector."
    },
    {
      code: `.class {
      &:not(.other-class) { }
    }`,
      description: "{ never } `.class { &:not() { ... } }` -- selector."
    },
    {
      code: `.test4\\:3 {}`,
      description: "{ never } selector with escaping"
    }
  ],

  reject: [
    /* {
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
      column: 9
    }, */
    {
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
      column: 9
    },
    {
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
      column: 13
    },
    {
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
      column: 9
    }
  ]
});
