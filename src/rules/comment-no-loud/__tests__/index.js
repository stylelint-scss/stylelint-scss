import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "// comment",
      description: "Double slash comments"
    },
    {
      code: "//* comment",
      description: "Double slash comments with first character as asterix"
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
      description: "Multline comment with optional ending on next line",
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
