import rule from "../index.js";

const { ruleName, messages } = rule;

// -------------------------------------------------------------------------
// "always"
// -------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a {} // Inline comment, outside a ruleset.",
      description: "Inline comment, outside a ruleset."
    },
    {
      code: `a { // Inline comment, after {.
      width: 10px;
    }`,
      description: "Inline comment, after {."
    },
    {
      code: `
      a, // Inline comment between selectors.
      b {
        width: 10px;
      }
    `,
      description: "Inline comment between selectors."
    },
    {
      code: `a {
      /* Non-inline CSS comment, ignored */
      width: 10px;
    }`,
      description: "Non-inline CSS comment, ignored."
    }
  ],

  reject: [
    {
      code: `
      a { }
      // Non-inline comment (after a ruleset)
    `,
      description: "Non-inline comment (after a ruleset)",
      message: messages.expected,
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 46
    },
    {
      code: `
      a,
      // Non-inline comment between selectors
      b { }
    `,
      description: "Non-inline comment between selectors.",
      message: messages.expected,
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 46
    },
    {
      code: `
      a {
        // Non-inline comment (before a decl)
        width: 10px;
      }
    `,
      description: "Non-inline comment (before a decl)",
      message: messages.expected,
      line: 3,
      column: 9,
      endLine: 3,
      endColumn: 46
    }
  ]
});

testRule({
  ruleName,
  config: ["always"],
  syntax: "html",
  skip: true,

  accept: [
    {
      code: `
// Just text
<style type="text/scss">
a {} // Inline comment, outside a ruleset.
</style>
// Just text
`
    }
  ],

  reject: [
    {
      code: `
// Just text
<style type="text/scss">
a {
  // Non-inline comment (before a decl)
  width: 10px;
}
</style>
// Just text
`,
      message: messages.expected,
      line: 5,
      column: 3
    }
  ]
});

testRule({
  ruleName,
  config: ["always", { ignore: ["stylelint-commands"] }],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      a {
        color: pink;
        // stylelint-disable something
        top: 0;
      }
    `,
      description: "stylelint command non-inline comment."
    }
  ]
});

// -------------------------------------------------------------------------
// "never"
// -------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      // comment
    `,
      description: "Non-inline comment, outside rulesets."
    },
    {
      code: `// comment
    `,
      description: "Non-inline comment, the very start of the stylesheet."
    },
    {
      code: `
      a { color: red; }
      // Non-inline comment, outside rulesets.
    `,
      description: "Non-inline comment, outside rulesets."
    },
    {
      code: `
      a {
        color: red; /* Inline CSS comment, ignored */
      }
    `,
      description: "Inline CSS comment, ignored."
    }
  ],

  reject: [
    {
      code: "a {} // comment",
      message: messages.rejected,
      description: "Inline comment, outside a ruleset."
    },
    {
      code: `
      a {
        width: 10px;             // Inline comment, inside a ruleset.
      }
    `,
      message: messages.rejected,
      description: "Inline comment, inside a ruleset.",
      line: 3,
      column: 34,
      endLine: 3,
      endColumn: 70
    },
    {
      code: `
      a, // Inline comment, between selectors.
      b {
        width: 10px;
      }
    `,
      message: messages.rejected,
      description: "Inline comment, between selectors.",
      line: 2,
      column: 10,
      endLine: 2,
      endColumn: 47
    }
  ]
});

testRule({
  ruleName,
  config: ["never"],
  syntax: "html",
  skip: true,

  accept: [
    {
      code: `
// Just text
<style type="text/scss">
// comment
</style>
// Just text
`
    }
  ],

  reject: [
    {
      code: `
// Just text
<style type="text/scss">
a {} // comment
</style>
// Just text
`,
      message: messages.rejected,
      line: 4,
      column: 6
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { ignore: ["stylelint-commands"] }],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      a {
        color: pink; // stylelint-disable something
        top: 0;
      }
    `,
      description: "stylelint command inline comment."
    }
  ]
});
