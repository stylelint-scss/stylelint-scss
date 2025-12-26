import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @use "foo";
    `,
      description: "Default namespace"
    },
    {
      code: `
      @use "foo" as bar;
    `,
      description: "Explicit namespace"
    }
  ],

  reject: [
    {
      code: `
      @use "foo" as *;
    `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 22,
      message: messages.rejected,
      description: "Without namespace"
    },
    {
      code: `
      @use "foo"as*;
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 20,
      message: messages.rejected,
      description: "Without space"
    },
    {
      code: `
      @use "foo"   as   *  ;
    `,
      line: 2,
      column: 20,
      endLine: 2,
      endColumn: 26,
      message: messages.rejected,
      description: "With many spaces"
    },
    {
      code: `
      @use "foo" as * with ($baz: 1px);
    `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 22,
      message: messages.rejected,
      description: "Configured"
    },
    {
      code: `
      @use "foo" as * with (
        $baz: 1px
      );
    `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 22,
      message: messages.rejected,
      description: "Configured multiline"
    }
  ]
});
