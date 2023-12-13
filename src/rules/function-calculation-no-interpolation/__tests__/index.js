import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `.a { .b: calc(1 + 1); }`,
      description: "`calc` function, no interpolation"
    },
    {
      code: `
      $c: 1;
      .a { .b: abc(#{$c} + 1px); }
      `,
      description: "Allowed function with interpolation"
    },
    {
      code: `
      $c: 1;
      .a { .b: calc(abc(#{$c})); }
      `,
      description: "Allowed function with interpolation nested in `calc`"
    },
    {
      code: `
      $c: 1;
      --test-d: calc(#{$c} + 1);
      `,
      description:
        "Custom property declaration with interpolation inside `calc`"
    }
  ],
  reject: [
    {
      code: `
      $c: 1;
      .a { .b: calc(#{$c} + 1); }
      `,
      line: 3,
      column: 21,
      endLine: 3,
      endColumn: 26,
      message: messages.rejected("calc"),
      description: "`calc` function one argument interpolated"
    },
    {
      code: `
      $c: 1;
      .a { .b: calc(#{$c + 1}); }
      `,
      line: 3,
      column: 21,
      endLine: 3,
      endColumn: 25,
      message: messages.rejected("calc"),
      description: "`calc` function all arguments interpolated"
    },
    {
      code: `
      $c: 1;
      .a { .b: calc(max(#{$c})); }
      `,
      line: 3,
      column: 25,
      endLine: 3,
      endColumn: 30,
      message: messages.rejected("max"),
      description: "`max` function with interpolation"
    },
    {
      code: `
      $c: 1;
      .a { .b: min(#{$c} + 1px); }
      `,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 25,
      message: messages.rejected("min"),
      description: "`min` function with interpolation"
    },
    {
      code: `
      $c: 1;
      .a { .b: clamp(#{$c} + #{$d}); }
      `,
      line: 3,
      column: 22,
      endLine: 3,
      endColumn: 27,
      message: messages.rejected("clamp"),
      description: "`clamp` function with interpolation"
    }
  ]
});
