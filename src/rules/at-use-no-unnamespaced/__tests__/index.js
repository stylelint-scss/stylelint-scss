import { messages, ruleName } from "..";

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @use "foo";
    `,
      description: "Default namespace",
    },
    {
      code: `
      @use "foo" as bar;
    `,
      description: "Explicit namespace",
    },
  ],

  reject: [
    {
      code: `
      @use "foo" as *;
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Without namespace",
    },
    {
      code: `
      @use "foo"as*;
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Without space",
    },
    {
      code: `
      @use "foo"   as   *  ;
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "With many spaces",
    },
    {
      code: `
      @use "foo" as * with ($baz: 1px);
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Configured",
    },
    {
      code: `
      @use "foo" as * with (
        $baz: 1px
      );
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Configured multiline",
    },
  ],
});
