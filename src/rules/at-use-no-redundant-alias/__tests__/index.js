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

// Test with fix
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @use "foo";
      `,
      description: "Default namespace"
    }
  ],
  reject: [
    {
      code: `@use "foo" as foo;`,
      fixed: `@use "foo";`,
      line: 1,
      column: 1,
      message: messages.rejected,
      description: "Without url"
    },
    {
      code: `@use "src/corners" as corners;`,
      fixed: `@use "src/corners";`,
      line: 1,
      column: 1,
      message: messages.rejected,
      description: "With url"
    },
    {
      code: `@use "sass:math" as math;`,
      fixed: `@use "sass:math";`,
      line: 1,
      column: 1,
      message: messages.rejected,
      description: "Built-in module"
    },
    {
      code: `@use "foo"   as   foo;`,
      fixed: `@use "foo";`,
      line: 1,
      column: 1,
      message: messages.rejected,
      description: "Without space"
    },
    {
      code: `@use "foo" as foo with ($baz: 1px);`,
      fixed: `@use "foo" with ($baz: 1px);`,
      line: 1,
      column: 1,
      message: messages.rejected,
      description: "Configured"
    },
    {
      code: `
      @use "sass:color" as color with (
        $baz: 1px
      );
    `,
      fixed: `
      @use "sass:color" with (
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
