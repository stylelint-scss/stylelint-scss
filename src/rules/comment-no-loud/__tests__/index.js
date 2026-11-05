import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "// comment",
      description: "Double slash comments"
    },
    {
      code: "//* comment",
      description: "Double slash comments with first character as asterisk"
    },
    {
      code: `
      .foo { // comment
        a: b; // comment /* not loud */
      }
    `,
      description: "Double slash comments at the end of a line"
    }
  ],
  reject: [
    {
      code: `
      /* comment */
    `,
      description: "One line with optional ending",
      line: 2,
      column: 7,
      message: messages.expected
    },
    {
      code: `
        /* comment line 1
           comment line 2
        */
    `,
      description: "Multiline comment with optional ending on next line",
      line: 2,
      column: 9,
      message: messages.expected
    },
    {
      code: `
      i {
        font-style: italic;
      }

      /* comment line */

      b {
        font-weight: bold;
      }
    `,
      description: "Comment sandwiched between rules",
      line: 6,
      column: 7,
      message: messages.expected
    },
    {
      code: `
      .foo { /* comment */
        a: b;
      }
    `,
      description: "Comment at the end of a line with a selector",
      line: 2,
      column: 14,
      message: messages.expected
    },
    {
      code: `
      .foo {
        a: b; /* comment */
      }
    `,
      description: "Comment at the end of a line with a declaration",
      line: 3,
      column: 15,
      message: messages.expected
    }
  ]
});
