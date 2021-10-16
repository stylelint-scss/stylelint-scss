import { ruleName, messages } from "..";

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
    }
  ]
});
