import rule, { ruleName, messages } from "..";

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
      description: "Two dollar variables with the same name and nesting."
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
