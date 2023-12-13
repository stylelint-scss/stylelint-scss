"use strict";

const { messages, ruleName } = require("..");

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
