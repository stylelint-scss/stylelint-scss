import rule from "../index.js";

const { ruleName, messages } = rule;

const syntaxVariants = [
  { syntaxLabel: "default syntax" },
  { syntaxLabel: "postcss-scss", customSyntax: "postcss-scss" }
];

const withSyntaxLabel = (syntaxLabel, testCases) =>
  testCases.map(testCase => ({
    ...testCase,
    description: `${testCase.description} (${syntaxLabel})`
  }));

// --------------------------------------------------------------------------
// always
// --------------------------------------------------------------------------

const alwaysAcceptCases = [
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
];

const alwaysRejectCases = [
  {
    code: `
      a {
        background-color: red;
        background-repeat: no-repeat;
      }
    `,
    description: "{ always } Simple test: background-color, background-repeat",
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
];

// Run test with basic checks
testRule({
  ruleName,
  config: ["always"]
});

// Run tests for each syntax variant
for (const { syntaxLabel, ...options } of syntaxVariants) {
  testRule({
    ruleName,
    config: ["always"],
    ...options,
    skipBasicChecks: true,
    accept: withSyntaxLabel(syntaxLabel, alwaysAcceptCases)
  });

  testRule({
    ruleName,
    config: ["always"],
    ...options,
    skipBasicChecks: true,
    reject: withSyntaxLabel(syntaxLabel, alwaysRejectCases)
  });
}

// --------------------------------------------------------------------------
// always, except: only-of-namespace
// --------------------------------------------------------------------------

const alwaysExceptAcceptCases = [
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
];

const alwaysExceptRejectCases = [
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
];

for (const { syntaxLabel, ...options } of syntaxVariants) {
  testRule({
    ruleName,
    config: ["always", { except: "only-of-namespace" }],
    ...options,
    skipBasicChecks: true,
    accept: withSyntaxLabel(syntaxLabel, alwaysExceptAcceptCases)
  });

  testRule({
    ruleName,
    config: ["always", { except: "only-of-namespace" }],
    ...options,
    skipBasicChecks: true,
    reject: withSyntaxLabel(syntaxLabel, alwaysExceptRejectCases)
  });
}

// --------------------------------------------------------------------------
// never
// --------------------------------------------------------------------------

const neverAcceptCases = [
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
];

const neverRejectCases = [
  {
    code: `
      a {
        background: red {
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
];

for (const { syntaxLabel, ...options } of syntaxVariants) {
  testRule({
    ruleName,
    config: ["never"],
    ...options,
    skipBasicChecks: true,
    accept: withSyntaxLabel(syntaxLabel, neverAcceptCases)
  });

  testRule({
    ruleName,
    config: ["never"],
    ...options,
    skipBasicChecks: true,
    reject: withSyntaxLabel(syntaxLabel, neverRejectCases)
  });
}
