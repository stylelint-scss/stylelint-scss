import rule from "../index.js";

const { ruleName, messages } = rule;

// --------------------------------------------------------------------------
// always
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",
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
      description: "{ always } nested properties"
    },
    {
      code: `
      a {
        background: {
          color: red
        };
      }
    `,
      description: "{ always } one `background` in nested form"
    }
  ],

  reject: [
    {
      code: `
      a {
        background-color: red;
        background-repeat: no-repeat;
      }
    `,
      description:
        "{ always } Simple test: background-color, background-repeat",
      warnings: [
        {
          line: 3,
          column: 9,
          message: messages.expected("background-color")
        },
        {
          line: 4,
          column: 9,
          message: messages.expected("background-repeat")
        }
      ]
    },
    {
      code: `
      a {
        background-color: red;
        @media (color) { background-image: url(img.png); }
        background-repeat: no-repeat;
      }
    `,
      description:
        "{ always } background-color, background-repeat separated by at-rule",
      warnings: [
        {
          line: 3,
          column: 9,
          message: messages.expected("background-color")
        },
        {
          line: 5,
          column: 9,
          message: messages.expected("background-repeat")
        },
        {
          line: 4,
          column: 26,
          message: messages.expected("background-image")
        }
      ]
    },
    {
      code: `
      a {
        background: url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `,
      description: "{ always } nested `background` and background-position",
      warnings: [
        {
          line: 6,
          column: 9,
          message: messages.expected("background-position")
        }
      ]
    },
    {
      code: `
      a {
        background:   url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `,
      description: "{ always } `prop:    value {nested} prop-v: value`.",
      warnings: [
        {
          line: 6,
          column: 9,
          message: messages.expected("background-position")
        }
      ]
    },
    {
      code: `
      a {
        background  : url(img.png) no-repeat {
          color: red
        };
        background-position: center;
      }
    `,
      description: "{ always } `prop  :  value {nested} prop-v: value`.",
      warnings: [
        {
          line: 6,
          column: 9,
          message: messages.expected("background-position")
        }
      ]
    }
  ]
});

// --------------------------------------------------------------------------
// always, except: only-of-namespace
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always", { except: "only-of-namespace" }],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      a {
        position: absolute;
        background-color: red;
      }
    `,
      description: "{ always, except: only-of-namespace } background-color only"
    },
    {
      code: `
      a {
        background:red {
          origin: padding-box;
        }
        background-position: center;
      }
    `,
      description:
        "{ always, except: only-of-namespace } `background:red`, one rule inside"
    },
    {
      code: `
      a {
        background: red {
          origin: padding-box;
          repeat: no-repeat;
        }
      }
    `,
      description:
        "{ always, except: only-of-namespace } background, two rules inside"
    }
  ],

  reject: [
    {
      code: `
      a {
        background-color: red;
        @media (color) { background-image: url(img.png); }
        background-repeat: no-repeat;
      }
    `,
      description:
        "{ always, except: only-of-namespace } background-color, background-repeat separated by at-rule",
      warnings: [
        {
          line: 3,
          column: 9,
          message: messages.expected("background-color")
        },
        {
          line: 5,
          column: 9,
          message: messages.expected("background-repeat")
        }
      ]
    },
    {
      code: `
      a {
        background: {
          origin: padding-box;
        }
        background: {
          color: red;
        }
      }
    `,
      description: "{ always, except: only-of-namespace } `prop:`, one rule X2",
      warnings: [
        {
          line: 3,
          column: 9,
          message: messages.rejected("background")
        },
        {
          line: 6,
          column: 9,
          message: messages.rejected("background")
        }
      ]
    },
    {
      code: `
      a {
        background: red {
          origin: padding-box;
        }
      }
    `,
      description:
        "{ always, except: only-of-namespace } `prop: value`, one rule inside",
      warnings: [
        {
          line: 3,
          column: 9,
          message: messages.rejected("background")
        }
      ]
    },
    {
      code: `
      a {
        background: red {
          origin: padding-box;
          repeat: repeat-x;
        }
        background-position: center;
      }
    `,
      description:
        "{ always, except: only-of-namespace } `background:red`, one rule inside 2",
      warnings: [
        {
          line: 7,
          column: 9,
          message: messages.expected("background-position")
        }
      ]
    }
  ]
});

// --------------------------------------------------------------------------
// never
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
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
      code: ".test4\\:3 {}",
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
