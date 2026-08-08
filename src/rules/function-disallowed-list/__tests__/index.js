import rule from "../index.js";

const { ruleName, messages } = rule;

// Testing single value
testRule({
  ruleName,
  config: ["random"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
        @use "sass:math"
        .a { margin-left: math.round(100.5); }
      `,
      description: "Math library function, allowed."
    }
  ],
  reject: [
    {
      code: `
            @use "sass:math"
            .a { margin-left: math.random(100); }
          `,
      line: 3,
      column: 36,
      endLine: 3,
      endColumn: 42,
      message: messages.rejected("random"),
      description: "Math library function, not allowed."
    }
  ]
});

// Testing an array
testRule({
  ruleName,
  config: [["random", /test/]],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @use "sass:math"
      .a { margin-left: math.round(100.5); }
    `,
      description: "Math library function, allowed."
    },
    {
      code: `
          @function funcName($num){@return $num;}
          .a { margin-left: funcName(3); }
        `,
      description: "Declared function is allowed."
    }
  ],
  reject: [
    {
      code: `
          @use "sass:math"
          .a { margin-left: math.random(100); }
        `,
      line: 3,
      column: 34,
      endLine: 3,
      endColumn: 40,
      message: messages.rejected("random"),
      description: "Math library function, not allowed."
    },
    {
      code: `
        @function test($num){@return $num;}
        .a { margin-left: test(3); }
      `,
      line: 3,
      column: 27,
      endLine: 3,
      endColumn: 31,
      message: messages.rejected("test"),
      description: "Declared function is not allowed (regex)."
    },
    {
      code: `
        @function random($num){@return $num;}
        .a { margin-left: random(5); }
      `,
      line: 3,
      column: 27,
      endLine: 3,
      endColumn: 33,
      message: messages.rejected("random"),
      description: "Declared function is not allowed."
    }
  ]
});

// Testing @return expression
testRule({
  ruleName,
  config: ["random"],
  customSyntax: "postcss-scss",

  reject: [
    {
      code: `
        @use "sass:math"
        @function get-random-value() {
          @return math.random(100.5);
        }
        .a { margin-left: get-random-value(); }
      `,
      message: messages.rejected("random"),
      description: "Math library function in @return expression, not allowed."
    }
  ]
});

// Testing at-rule params
testRule({
  ruleName,
  config: ["random"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
        @use "sass:math";
        .a {
          @if math.round(100.5) > 50 { margin-left: 10px; }
        }
      `,
      description: "Math library function in @if condition, allowed."
    }
  ],
  reject: [
    {
      code: `
        @use "sass:math";
        .a {
          @if math.random(100) > 50 { margin-left: 10px; }
        }
      `,
      message: messages.rejected("random"),
      description: "Math library function in @if condition, not allowed."
    },
    {
      code: `
        @use "sass:math";
        .a {
          @if $a { margin-left: 10px; }
          @else if math.random(100) > 50 { margin-left: 20px; }
        }
      `,
      message: messages.rejected("random"),
      description: "Math library function in @else if condition, not allowed."
    },
    {
      code: `
        @use "sass:math";
        @media (width >= #{math.random(100)}) { .a { margin-left: 10px; } }
      `,
      message: messages.rejected("random"),
      description: "Math library function in @media params, not allowed."
    },
    {
      code: `
        @use "sass:math";
        @each $i in math.random(3) { .a { margin-left: 10px; } }
      `,
      message: messages.rejected("random"),
      description: "Math library function in @each params, not allowed."
    },
    {
      code: `
        @use "sass:math";
        @mixin min-width($value) { @media (width >= #{$value}) { @content; } }
        @include min-width(math.random(100)) { .a { margin-left: 10px; } }
      `,
      message: messages.rejected("random"),
      description: "Math library function in @include argument, not allowed."
    },
    {
      code: `
        @use "sass:math";
        @mixin min-width($value: math.random(100)) { @content; }
      `,
      message: messages.rejected("random"),
      description: "Math library function in @mixin default value, not allowed."
    },
    {
      code: `
        @use "sass:math";
        @function min-width($value: math.random(100)) { @return $value; }
      `,
      message: messages.rejected("random"),
      description:
        "Math library function in @function default value, not allowed."
    }
  ]
});

// Testing that the name of a mixin or function is not treated as a call
testRule({
  ruleName,
  config: ["min-width"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
        @mixin min-width($value) { @media (width >= #{$value}) { @content; } }
        @include min-width(100px) { .a { margin-left: 10px; } }
      `,
      description: "Mixin named like a disallowed function, allowed."
    },
    {
      code: `
        @function min-width($value) { @return $value; }
      `,
      description:
        "Function declaration named like a disallowed function, allowed."
    }
  ],
  reject: [
    {
      code: `
        .a { margin-left: min-width(100px); }
      `,
      message: messages.rejected("min-width"),
      description: "Calling the function is still not allowed."
    }
  ]
});
