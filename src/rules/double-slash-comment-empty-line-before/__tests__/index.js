"use strict";

const { rule, ruleName, messages } = require("..");

// Used in all "always" tests
const alwaysGeneralTests = {
  accept: [
    {
      code: "// First node, ignored",
      description: "First node, ignored."
    },
    {
      code: `
      a { color: pink; /* CSS comment */
      top: 0; }
    `,
      description: "CSS comment inside ruleset, ignored."
    },
    {
      code: "a {} /* CSS comment */",
      description: "CSS comment in root scope, ignored."
    },
    {
      code: "a {} // Inline comment",
      description: "Inline comment (on the same line as some code)."
    },
    {
      code: `
      a {}

      // comment with empty line before it
    `,
      description: "Proper empty line, root scope."
    },
    {
      code: "a {}\r\n\r\n// comment with Win empty line",
      description: "Proper empty line (Windows style)."
    },
    {
      code: "a {}\n\r\n// comment with mixed empty line",
      description: "Proper empty lint (mixed styles)."
    },
    {
      code: `
      a { color: pink;

      // comment with proper empty line
      top: 0; }
    `,
      description: "Proper empty line, inside ruleset."
    }
  ],

  reject: [
    {
      code: `
      // comment 1
      // comment 2
    `,
      fixed: `
      // comment 1

      // comment 2
    `,
      message: messages.expected
    },
    {
      code: "// comment\r\n// comment",
      fixed: "// comment\r\n\r\n// comment",
      description: "One windows newline between comments.",
      message: messages.expected
    },
    {
      code: `
      a { color: pink;
      // comment w/o empty line
      top: 0; }
    `,
      fixed: `
      a { color: pink;

      // comment w/o empty line
      top: 0; }
    `,
      message: messages.expected
    },
    {
      code:
        "a { color: pink;\r\n// comment w/o empty lines, Win style\r\ntop: 0; }",
      fixed:
        "a { color: pink;\r\n\r\n// comment w/o empty lines, Win style\r\ntop: 0; }",
      description: "One Windows newline before comment.",
      message: messages.expected
    }
  ]
};

// -------------------------------------------------------------------------
// "always"
// -------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  skipBasicChecks: true,
  fix: true,

  accept: alwaysGeneralTests.accept.concat([
    {
      code: `a {

      // First-nested, empty line before
      color: pink;
    }`,
      description: "First-nested, empty line before."
    }
  ]),

  reject: alwaysGeneralTests.reject.concat([
    {
      code: `a {
      // First-nested, no empty line before.
      color: pink;
    }`,
      fixed: `a {

      // First-nested, no empty line before.
      color: pink;
    }`,
      description: "First-nested, no empty line before.",
      message: messages.expected,
      line: 2,
      column: 7
    }
  ])
});

testRule(rule, {
  ruleName,
  config: ["always", { except: ["first-nested"] }],
  syntax: "scss",
  skipBasicChecks: true,
  fix: true,

  accept: alwaysGeneralTests.accept.concat([
    {
      code: `
      a {
        // First nested, no empty line.
        color: pink;
      }
    `,
      description: "First nested, no empty line."
    }
  ]),

  reject: alwaysGeneralTests.reject.concat([
    {
      code: `
      a {

      // First-nested, with empty line (rejected).
      color: pink;
    }`,
      fixed: `
      a {
      // First-nested, with empty line (rejected).
      color: pink;
    }`,
      description: "First-nested, with empty line (rejected).",
      message: messages.rejected,
      line: 4,
      column: 7
    }
  ])
});

testRule(rule, {
  ruleName,
  config: ["always", { ignore: ["stylelint-commands"] }],
  syntax: "scss",
  skipBasicChecks: true,

  accept: alwaysGeneralTests.accept.concat([
    {
      code: `
      a {
        color: pink;
        // stylelint-disable something
        top: 0;
      }
    `,
      description:
        "stylelint command line-comment, no empty line before (ignored)."
    }
  ])
});

testRule(rule, {
  ruleName,
  config: ["always", { ignore: ["between-comments"] }],
  syntax: "scss",
  skipBasicChecks: true,
  fix: true,

  accept: [
    {
      code: `
      // comment 1
      // comment 2
      // comment 3
      body { color: red; }
    `,
      description: "Multiple comments, root level, no empty lines between."
    },
    {
      code: `
      a { color: pink;

      /// comment 1
      /// comment 2
      top: 0;
    }`,
      description:
        "Multiple comments, inside ruleset, empty line only before the 1st."
    },
    {
      code: `
      a { color: pink;

      /* comment 1 */
      /// comment 2
      top: 0;
    }`,
      description:
        "2 comments, 1st is CSS one, 2nd is single-line, empty line only before the 1st."
    },
    {
      code: `
      a { color: pink;

      /// comment 1
      /* comment 2 */
      top: 0;
    }`,
      description:
        "2 comments, 1st is single-line, 2nd is CSS one, empty line only before the 1st."
    }
  ],

  reject: [
    {
      code: `
      a {
        color: pink;
        /// comment
        /// comment
        top: 0;
      }
    `,
      fixed: `
      a {
        color: pink;

        /// comment
        /// comment
        top: 0;
      }
    `,
      description: "Multiple comments, inside ruleset, no empty lines.",
      message: messages.expected
    }
  ]
});

// -------------------------------------------------------------------------
// "never"
// -------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  skipBasicChecks: true,
  fix: true,

  accept: [
    {
      code: `

      // comment
    `,
      description: "First nested, empty line, ignored."
    },
    {
      code: "\r\n\r\n// comment",
      description: "First nested, CRLF-empty line, ignored."
    },
    {
      code: `
      a {
        color: pink;

        /** CSS comment */
        top: 0;
      }
    `,
      description: "CSS comment, ignored"
    },
    {
      code: "a {} // Inline comment"
    },
    {
      code: `a {
      color: pink;
      // comment

      top: 0;
    }
  `
    },
    {
      code: "a { color: pink;\r\n// comment\r\n\r\ntop: 0; }",
      description: "CRLF"
    }
  ],

  reject: [
    {
      code: `
      // comment

      /// comment
    `,
      fixed: `
      // comment
      /// comment
    `,
      message: messages.rejected
    },
    {
      code: `
      a {}

      // comment
    `,
      fixed: `
      a {}
      // comment
    `,
      message: messages.rejected
    },
    {
      code: `
      a {}


      // comment
    `,
      fixed: `
      a {}
      // comment
    `,
      description: "multiple lines",
      message: messages.rejected
    },
    {
      code: "a {}\n\n\n\n\n\n// comment",
      fixed: "a {}\n// comment",
      description: "multiple lines",
      message: messages.rejected
    },
    {
      code: "a {}\r\n\r\n// comment",
      fixed: "a {}\r\n// comment",
      description: "CRLF",
      message: messages.rejected
    },
    {
      code: "a {}\r\n\r\n\r\n// comment",
      fixed: "a {}\r\n// comment",
      description: "CRLF",
      message: messages.rejected
    },
    {
      code: `
      a {
        color: pink;

        // comment
        top: 0;
      }
    `,
      fixed: `
      a {
        color: pink;
        // comment
        top: 0;
      }
    `,
      message: messages.rejected
    },
    {
      code: `
      h3 {

        // font-family: $fontStack;
        color: $textBlack;
        font-weight: 400;
        font-size: 24px;

        // font-weight: 700;
        line-height: 35px;

      }
    `,
      fixed: `
      h3 {
        // font-family: $fontStack;
        color: $textBlack;
        font-weight: 400;
        font-size: 24px;
        // font-weight: 700;
        line-height: 35px;

      }
    `,
      description: "issue #321",
      message: messages.rejected
    }
  ]
});
