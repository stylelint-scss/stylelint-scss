"use strict";

const { messages, ruleName } = require("..");

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
      @use "foo/bar" as foo;
    `,
      description: "Different namespace"
    },
    {
      code: `
      @use "sass:math" as *;
    `,
      description: "Without namespace"
    },
    {
      code: `
      @use "sass:math";
    `,
      description: "No explicit namespace"
    }
  ],

  reject: [
    {
      code: `
      @use "foo" as foo;
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Without url"
    },
    {
      code: `
      @use "src/corners" as corners;
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "With url"
    },
    {
      code: `
      @use "sass:math" as math;
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Built-in module"
    },
    {
      code: `
      @use "foo"   as   foo;
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Without space"
    },
    {
      code: `
      @use "foo" as foo with ($baz: 1px);
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Configured"
    },
    {
      code: `
      @use "sass:color" as color with (
        $baz: 1px
      );
    `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "Configured multiline"
    }
  ]
});
