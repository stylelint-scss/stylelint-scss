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

const acceptCases = [
  {
    code: `
      a {
        background: no-repeat;
        margin: 1px;
      }
    `,
    description: "No groups."
  },
  {
    code: `
      a {
        background: url(img.png) center;
        background-repeat: no-repeat;
      }
    `,
    description: "No groups #2."
  },
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background-repeat: no-repeat;
      }
    `,
    description: "One group, one unnested."
  },
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background-color: red;
        background-repeat: no-repeat;
      }
    `,
    description: "One group, two unnested."
  },
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background :red {
          repeat: no-repeat;
        }
      }
    `,
    description: "One group, one selector."
  },
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        margin: 10px {
          left: 1px;
        }
      }
    `,
    description: "Multiple groups, different namespaces."
  },
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        @media (color) {
          background: red {
            repeat: no-repeat;
          }
        }
      }
    `,
    description: "Two groups on one namespace, one nested in @media."
  },
  {
    code: `
      a {
        &:not(.other-class) { }
        &:not(.another-class) { }
      }
    `,
    description: "Two groups of &:not()."
  }
];

const rejectCases = [
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background : red {
          repeat: no-repeat;
        }
      }
    `,
    description: "2 groups of the same namespace.",
    warnings: [
      {
        line: 3,
        column: 9,
        endLine: 3,
        endColumn: 19,
        message: messages.expected("background")
      },
      {
        line: 6,
        column: 9,
        endLine: 6,
        endColumn: 19,
        message: messages.expected("background")
      }
    ]
  },
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background : {
          repeat: no-repeat;
        }
      }
    `,
    description: "2 groups, second one has no value",
    warnings: [
      {
        line: 3,
        column: 9,
        message: messages.expected("background")
      },
      {
        line: 6,
        column: 9,
        message: messages.expected("background")
      }
    ]
  },
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        margin: 10px {
          left: 1px;
        }

        background: linear-gradient(to bottom, red 0%, blue 10%) {
          position: center;
        }
      }
    `,
    description: "3 groups, 1 and 3 has the same namespace",
    warnings: [
      {
        line: 3,
        column: 9,
        message: messages.expected("background")
      },
      {
        line: 10,
        column: 9,
        message: messages.expected("background")
      }
    ]
  },
  {
    code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background: red {
          repeat: no-repeat;
        }

        background: linear-gradient(to bottom, red 0%, blue 10%) {
          position: center;
        }
      }
    `,
    description: "3 groups of the same namespace",
    warnings: [
      {
        line: 3,
        column: 9,
        message: messages.expected("background")
      },
      {
        line: 6,
        column: 9,
        message: messages.expected("background")
      },
      {
        line: 10,
        column: 9,
        message: messages.expected("background")
      }
    ]
  }
];

// Run test with basic checks
testRule({
  ruleName,
  config: [true]
});

// Run tests for each syntax variant
for (const { syntaxLabel, ...options } of syntaxVariants) {
  testRule({
    ruleName,
    config: [true],
    ...options,
    skipBasicChecks: true,
    accept: withSyntaxLabel(syntaxLabel, acceptCases)
  });

  testRule({
    ruleName,
    config: [true],
    ...options,
    skipBasicChecks: true,
    reject: withSyntaxLabel(syntaxLabel, rejectCases)
  });
}
