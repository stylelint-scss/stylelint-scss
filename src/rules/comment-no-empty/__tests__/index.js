import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "// comment",
      description: "Double slash comment"
    },
    {
      code: "//* comment",
      description: "Double slash comments with first character as asterix"
    },
    {
      code: "/* comment */",
      description: "Single line block comment"
    }
  ],
  reject: [
    {
      code: `
      /**/
    `,
      description: "Empty block comment",
      message: messages.rejected,
      line: 2,
      column: 7
    },
    {
      code: `
        /*
        */
    `,
      description: "Empty multiline block comment",
      message: messages.rejected,
      line: 2,
      column: 9
    },
    {
      code: `
        /*

        */
      `,
      description: "Empty multiline block comment with an empty line",
      message: messages.rejected,
      line: 2,
      column: 9
    },
    {
      code: `
        //
      `,
      description: "Empty double slash comment",
      message: messages.rejected,
      line: 2
    },
    {
      code: `
        //
      `,
      description: "Empty double slash comment with spaces",
      message: messages.rejected,
      line: 2,
      column: 9
    },
    {
      code: `
        //\t
      `,
      description: "Empty double slash comment with tab",
      message: messages.rejected,
      line: 2,
      column: 9
    },
    {
      code: `
        width: 100px; //
      `,
      description: "Empty inline comment",
      message: messages.rejected,
      line: 2,
      column: 23
    },
    {
      code: `
        width: 100px; /* */
      `,
      description: "Empty inline block comment",
      message: messages.rejected,
      line: 2,
      column: 23
    },
    {
      code: `
      /* */width: 100px;
      `,
      description: "Empty inline block comment prepends code",
      message: messages.rejected,
      line: 2,
      column: 7
    }
  ]
});
