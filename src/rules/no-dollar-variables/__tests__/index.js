import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "a { color: blue; }",
      description: "No variables"
    },
    {
      code: "a { @less: 0; @less: @less + 1; }",
      description: "Less variables are ignored"
    },
    {
      code: "a { --custom-property: 0; --custom-property: 1; }",
      description: "Custom properties are ignored"
    }
  ],

  reject: [
    {
      code: `
      $a: 1;
    `,
      line: 2,
      column: 7,
      endLine: 2,
      endColumn: 9,
      message: messages.rejected("$a"),
      description: "A dollar variable"
    },
    {
      code: `
      $a: 1;

      $b: 2;
    `,
      warnings: [
        {
          line: 2,
          column: 7,
          message: messages.rejected("$a")
        },
        {
          line: 4,
          column: 7,
          message: messages.rejected("$b")
        }
      ],
      description: "Two dollar variables"
    },
    {
      code: `
      .b {
        $a: 1;
      }
    `,
      line: 3,
      column: 9,
      message: messages.rejected("$a"),
      description: "A dollar variable inside a class selector"
    },
    {
      code: `
      %b {
        $a: 1;
      }
    `,
      line: 3,
      column: 9,
      message: messages.rejected("$a"),
      description: "A dollar variable inside a placeholder selector"
    },
    {
      code: `
      @mixin test() {
        $a: 1;
      }
    `,
      line: 3,
      column: 9,
      message: messages.rejected("$a"),
      description: "A dollar variable inside a @mixin"
    },
    {
      code: `
      .b {
        .c {
          $a: 1;
        }
      }
    `,
      line: 4,
      column: 11,
      message: messages.rejected("$a"),
      description: "Nested dollar variable"
    }
  ]
});
