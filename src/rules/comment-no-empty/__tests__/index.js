import { ruleName, messages } from "..";

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "// comment",
      description: "Double slash comment"
    },
    {
      code: "//* comment",
      description: "Double slash comments with first character as asterisk"
    },
    {
      code: "/* comment */",
      description: "Single line block comment"
    },
    {
      code: `
        // comment
        //
        // comment
      `,
      description: "Multiline double slash comment with paragraph break"
    },
    {
      code: `
        //
        //
        // comment
        //
        //
      `,
      description:
        "Multiline double slash comment with leading and trailing empty lines"
    },
    {
      code: `
        /* comment

           comment */
      `,
      description: "Multiline block comment with paragraph break"
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
        //
        //
        //
      `,
      description: "Empty multiline double slash comment",
      message: messages.rejected,
      line: 2 // note, should be just one error at first line
    },
    {
      code: `
        //
        width: 100px; // comment
      `,
      description: "Empty double slash comment with trailing inline comment",
      message: messages.rejected,
      line: 2
    },
    {
      code: `
        width: 100px; // comment
        //
      `,
      description: "Empty double slash comment with preceding inline comment",
      message: messages.rejected,
      line: 3
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

test("messages", () => {
  expect(messages.rejected).toBe(
    "Unexpected empty comment (scss/comment-no-empty)"
  );
});
