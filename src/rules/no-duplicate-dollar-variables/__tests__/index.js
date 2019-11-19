"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
      $a: 1;
    `,
      description: "A single dollar variable."
    },
    {
      code: `
      $a: 1;
      $b: 2;
    `,
      description: "Two dollar variables with different names."
    },
    {
      code: `
      $a: 1; $b: 2;
    `,
      description: "Two dollar variables with different names on the same line."
    },
    {
      code: "a { $a: 0; $b: $a + 1; }",
      description:
        "Two dollar variables with different names on the same line and variable assign."
    },
    {
      code: "a { @less: 0; @less: @less + 1; }",
      description: "Less variables are ignored"
    },
    {
      code: "a { --custom-property: 0; --custom-property: 1; }",
      description: "Custom properties are ignored"
    },
    {
      code: `
      $a: 1;
      $ab: 2;
    `,
      description: "Two dollar variables with different names."
    },
    {
      code: `
      $a: 1;
      .b {
        $b: 2;
      }
    `,
      description:
        "Two dollar variables with different names and inside a selector."
    },
    {
      code: `
      $a: 1;
      .b {
        color: black;
      }
    `,
      description: "A single variable and a normal CSS property."
    }
  ],

  reject: [
    {
      code: `
      $a: 1;
      $a: 2;
    `,
      line: 3,
      column: 7,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name."
    },
    {
      code: `
      $a: 1; $a: 2;
    `,
      line: 2,
      column: 14,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name on the same line."
    },
    {
      code: `
      $a: 1;
      $a: 2;
      $a: 1;
    `,
      line: 3,
      column: 7,
      message: messages.rejected("$a"),
      description: "Three dollar variables with the same name."
    },
    {
      code: "a { $scss: 0; $scss: $scss + 1; }",
      line: 1,
      column: 15,
      message: messages.rejected("$scss"),
      description: "Two dollar variables with the same name inside a selector."
    },
    {
      code: `
      $a: 1;
      $b: 2;
      $a: 3;
    `,
      line: 4,
      column: 7,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name, variable between."
    },
    {
      code: `
      $a: 1;

      $b: 2;

      $a: 3;
    `,
      line: 6,
      column: 7,
      message: messages.rejected("$a"),
      description:
        "Two dollar variables with the same name, variable and newlines between."
    },
    {
      code: `
      $ab: 1;
      .b {
        $ab: 2;
      }
    `,
      line: 4,
      column: 9,
      message: messages.rejected("$ab"),
      description:
        "Two dollar variables with the same name and inside a selector."
    },
    {
      code: `
      $ab: 1;
      .b {
        @mixin c {
          $ab: 2;
        }
      }
    `,
      line: 5,
      column: 11,
      message: messages.rejected("$ab"),
      description: "Two dollar variables with the same name and nested @mixin."
    },
    {
      code: `
      $ab: 1;
      .b {
        & {
          $ab: 2;
        }
      }
    `,
      line: 5,
      column: 11,
      message: messages.rejected("$ab"),
      description:
        "Two dollar variables with the same name and nesting selector."
    },
    {
      code: `
      $a: blue;
      @mixin foo {
        $a: red;
        color: $a;
      }
      .b {
        color: $a;
        @include foo;
      }
    `,
      line: 4,
      column: 9,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name and @mixin."
    },
    {
      code: `
      $ab: 1;

      $ba: 2;
      .b {
        color: black;
        .c {
          $ab: 2;
        }
      }
    `,
      line: 8,
      column: 11,
      message: messages.rejected("$ab"),
      description:
        "Two dollar variables with the same name and multi-level nesting."
    },
    {
      code: `
      $ba: 2;
      .b {
        color: black;
        $ab: 1;
        .c {
          $ab: 2;
        }
      }
    `,
      line: 7,
      column: 11,
      message: messages.rejected("$ab"),
      description:
        "Two dollar variables with the same name and multi-level nesting."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { ignoreInside: "at-rule" }],
  syntax: "scss",

  accept: [
    {
      code: `
      $a: 1;

      .a {
        @mixin {
          $a: 2;
        }
      }
    `,
      description: "Should ignore inside nested @mixin."
    },
    {
      code: `
      $ab: 1;
      @mixin b {
        $ab: 2;
      }
    `,
      description: "Two dollar variables with the same name and inside @mixin."
    },
    {
      code: `
      $a: 1;

      .a {
        .b .c {
          @media (max-width: 500px) {
            $a: 2;
          }
        }
      }
    `,
      description: "Should ignore inside nested @media query."
    },
    {
      code: `
      $a: 1;
    `,
      description: "A single dollar variable."
    },
    {
      code: `
      $a: 1;
      $b: 2;
    `,
      description: "Two dollar variables with different names."
    },
    {
      code: `
      $a: 1; $b: 2;
    `,
      description: "Two dollar variables with different names on the same line."
    },
    {
      code: "a { $a: 0; $b: $a + 1; }",
      description:
        "Two dollar variables with different names on the same line and variable assign."
    },
    {
      code: "a { @less: 0; @less: @less + 1; }",
      description: "Less variables are ignored"
    },
    {
      code: "a { --custom-property: 0; --custom-property: 1; }",
      description: "Custom properties are ignored"
    },
    {
      code: `
      $a: 1;
      $ab: 2;
    `,
      description: "Two dollar variables with different names."
    },
    {
      code: `
      $a: 1;
      .b {
        $b: 2;
      }
    `,
      description: "Two dollar variables with different names and nesting."
    },
    {
      code: `
      $a: 1;
      .b {
        color: black;
      }
    `,
      description: "A single variable and a normal CSS property."
    }
  ],

  reject: [
    {
      code: `
      $a: 1;

      .a {
        .b {
          $a: 2;
        }
      }
    `,
      line: 6,
      column: 11,
      message: messages.rejected("$a"),
      description: "Should warn inside nested selector."
    },
    {
      code: `
      $a: 1;

      .a {
        & {
          $a: 2;
        }
      }
    `,
      line: 6,
      column: 11,
      message: messages.rejected("$a"),
      description: "Should warn inside nesting selector."
    },

    {
      code: `
      $a: 1;
      $b: 2;

      .a {
        $b: 3;
        .b {
          $a: 2;
        }
      }
    `,
      line: 6,
      column: 9,
      message: messages.rejected("$b"),
      description:
        "Should warn for a var inside the selector, but not for nested one."
    },
    {
      code: `
      $a: 1;
      $a: 2;
    `,
      line: 3,
      column: 7,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name."
    },
    {
      code: `
      $a: 1; $a: 2;
    `,
      line: 2,
      column: 14,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name on the same line."
    },
    {
      code: `
      $a: 1;
      $a: 2;
      $a: 1;
    `,
      line: 3,
      column: 7,
      message: messages.rejected("$a"),
      description: "Three dollar variables with the same name."
    },
    {
      code: "a { $scss: 0; $scss: $scss + 1; }",
      line: 1,
      column: 15,
      message: messages.rejected("$scss"),
      description: "Two dollar variables with the same name inside a selector."
    },
    {
      code: `
      $a: 1;
      $b: 2;
      $a: 3;
    `,
      line: 4,
      column: 7,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name, variable between."
    },
    {
      code: `
      $a: 1;

      $b: 2;

      $a: 3;
    `,
      line: 6,
      column: 7,
      message: messages.rejected("$a"),
      description:
        "Two dollar variables with the same name, variable and newlines between."
    },
    {
      code: `
      $ab: 1;
      .b {
        $ab: 2;
      }
    `,
      line: 4,
      column: 9,
      message: messages.rejected("$ab"),
      description:
        "Two dollar variables with the same name and inside a selector."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { ignoreInside: "nested-at-rule" }],
  syntax: "scss",

  accept: [
    {
      code: `
      $a: 1;

      .a {
        @mixin {
          $a: 2;
        }
      }
    `,
      description: "Should ignore inside nested @mixin."
    },
    {
      code: `
      $a: 1;

      .a {
        .b .c {
          @media (max-width: 500px) {
            $a: 2;
          }
        }
      }
    `,
      description: "Should ignore inside nested @media query."
    },
    {
      code: `
      $a: 1;
    `,
      description: "A single dollar variable."
    },
    {
      code: `
      $a: 1;
      $b: 2;
    `,
      description: "Two dollar variables with different names."
    },
    {
      code: `
      $a: 1; $b: 2;
    `,
      description: "Two dollar variables with different names on the same line."
    },
    {
      code: "a { $a: 0; $b: $a + 1; }",
      description:
        "Two dollar variables with different names on the same line and variable assign."
    },
    {
      code: "a { @less: 0; @less: @less + 1; }",
      description: "Less variables are ignored"
    },
    {
      code: "a { --custom-property: 0; --custom-property: 1; }",
      description: "Custom properties are ignored"
    },
    {
      code: `
      $a: 1;
      $ab: 2;
    `,
      description: "Two dollar variables with different names."
    },
    {
      code: `
      $a: 1;
      .b {
        $b: 2;
      }
    `,
      description: "Two dollar variables with different names and nesting."
    },
    {
      code: `
      $a: 1;
      .b {
        color: black;
      }
    `,
      description: "A single variable and a normal CSS property."
    }
  ],

  reject: [
    {
      code: `
      $a: 1;

      .a {
        .b {
          $a: 2;
        }
      }
    `,
      line: 6,
      column: 11,
      message: messages.rejected("$a"),
      description: "Should warn inside nested selector."
    },
    {
      code: `
      $a: 1;

      .a {
        & {
          $a: 2;
        }
      }
    `,
      line: 6,
      column: 11,
      message: messages.rejected("$a"),
      description: "Should warn inside nesting selector."
    },

    {
      code: `
      $a: 1;
      $b: 2;

      .a {
        $b: 3;
        .b {
          $a: 2;
        }
      }
    `,
      line: 6,
      column: 9,
      message: messages.rejected("$b"),
      description:
        "Should warn for a var inside the selector, but not for nested one."
    },
    {
      code: `
      $a: 1;
      $a: 2;
    `,
      line: 3,
      column: 7,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name."
    },
    {
      code: `
      $a: 1; $a: 2;
    `,
      line: 2,
      column: 14,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name on the same line."
    },
    {
      code: `
      $a: 1;
      $a: 2;
      $a: 1;
    `,
      line: 3,
      column: 7,
      message: messages.rejected("$a"),
      description: "Three dollar variables with the same name."
    },
    {
      code: "a { $scss: 0; $scss: $scss + 1; }",
      line: 1,
      column: 15,
      message: messages.rejected("$scss"),
      description: "Two dollar variables with the same name inside a selector."
    },
    {
      code: `
      $a: 1;
      $b: 2;
      $a: 3;
    `,
      line: 4,
      column: 7,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name, variable between."
    },
    {
      code: `
      $a: 1;

      $b: 2;

      $a: 3;
    `,
      line: 6,
      column: 7,
      message: messages.rejected("$a"),
      description:
        "Two dollar variables with the same name, variable and newlines between."
    },
    {
      code: `
      $ab: 1;
      .b {
        $ab: 2;
      }
    `,
      line: 4,
      column: 9,
      message: messages.rejected("$ab"),
      description:
        "Two dollar variables with the same name and inside a selector."
    },
    {
      code: `
      $ab: 1;
      @mixin b {
        $ab: 2;
      }
    `,
      line: 4,
      column: 9,
      message: messages.rejected("$ab"),
      description: "Two dollar variables with the same name and inside @mixin."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [true, { ignoreInsideAtRules: ["if", "mixin"] }],
  syntax: "scss",

  accept: [
    {
      code: `
      $a: 1;

      @mixin b {
        $a: 2;
      }
    `,
      description: "Should ignore inside @mixin."
    },
    {
      code: `
      $a: 1;

      .a {
        .b {
          @mixin c {
            $a: 2;
          }
        }
      }

    `,
      description: "Should ignore inside nested @mixin."
    },
    {
      code: `
      $a: 1;

      @if (true) {
        $a: 2;
      }
    `,
      description: "Should ignore inside @if."
    },
    {
      code: `
      $a: 1;
    `,
      description: "A single dollar variable."
    },
    {
      code: `
      $a: 1;
      $b: 2;
    `,
      description: "Two dollar variables with different names."
    },
    {
      code: `
      $a: 1; $b: 2;
    `,
      description: "Two dollar variables with different names on the same line."
    },
    {
      code: "a { $a: 0; $b: $a + 1; }",
      description:
        "Two dollar variables with different names on the same line and variable assign."
    },
    {
      code: "a { @less: 0; @less: @less + 1; }",
      description: "Less variables are ignored"
    },
    {
      code: "a { --custom-property: 0; --custom-property: 1; }",
      description: "Custom properties are ignored"
    },
    {
      code: `
      $a: 1;
      $ab: 2;
    `,
      description: "Two dollar variables with different names."
    },
    {
      code: `
      $a: 1;
      .b {
        $b: 2;
      }
    `,
      description:
        "Two dollar variables with different names and inside a selector."
    },
    {
      code: `
      $a: 1;
      .b {
        color: black;
      }
    `,
      description: "A single variable and a normal CSS property."
    }
  ],
  reject: [
    {
      code: `
      $c: 1;

      @function b() {
        $c: 2;
      }
    `,
      line: 5,
      column: 9,
      message: messages.rejected("$c"),
      description: "Should warn inside @function as it is not ignored."
    },
    {
      code: `
      $a: 1;
      $a: 2;
    `,
      line: 3,
      column: 7,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name."
    },
    {
      code: `
      $a: 1; $a: 2;
    `,
      line: 2,
      column: 14,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name on the same line."
    },
    {
      code: `
      $a: 1;
      $a: 2;
      $a: 1;
    `,
      line: 3,
      column: 7,
      message: messages.rejected("$a"),
      description: "Three dollar variables with the same name."
    },
    {
      code: "a { $scss: 0; $scss: $scss + 1; }",
      line: 1,
      column: 15,
      message: messages.rejected("$scss"),
      description: "Two dollar variables with the same name inside a selector."
    },
    {
      code: `
      $a: 1;
      $b: 2;
      $a: 3;
    `,
      line: 4,
      column: 7,
      message: messages.rejected("$a"),
      description: "Two dollar variables with the same name, variable between."
    },
    {
      code: `
      $a: 1;

      $b: 2;

      $a: 3;
    `,
      line: 6,
      column: 7,
      message: messages.rejected("$a"),
      description:
        "Two dollar variables with the same name, variable and newlines between."
    },
    {
      code: `
      $ab: 1;
      .b {
        $ab: 2;
      }
    `,
      line: 4,
      column: 9,
      message: messages.rejected("$ab"),
      description:
        "Two dollar variables with the same name and inside a selector."
    },
    {
      code: `
      $ab: 1;
      .b {
        & {
          $ab: 2;
        }
      }
    `,
      line: 5,
      column: 11,
      message: messages.rejected("$ab"),
      description:
        "Two dollar variables with the same name and nesting selector."
    }
  ]
});
