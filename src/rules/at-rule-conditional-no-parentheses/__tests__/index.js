import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: "@if true {}",
      description: "accepts @if with no parentheses"
    },
    {
      code: "@if (1 + 1) == 2 {}",
      description: "accepts parentheses statement where () used for math"
    },
    {
      code: "@while true {}",
      description: "accepts @while with no parentheses"
    },
    {
      code: `@if true {}
      @else if true {}`,
      description: "accepts @else if with no parentheses"
    },
    {
      code: `@if true {}
      @else if true {}
      @else {}`,
      description: "accepts @else unconditionally"
    },
    {
      code: `
      @function strip-unit($number) {
        @if type-of($number) == "number" and not unitless($number) {
          @return $number / ($number * 0 + 1);
        }

        @return $number;
      }
      `,
      description: "accepts function calls using @if"
    },
    {
      code: `
      @function strip-unit($number) {
        @if true {
          @return $number;
        }
        @else if type-of($number) == "number" and not unitless($number) {
          @return $number / ($number * 0 + 1);
        }

        @return $number;
      }
      `,
      description: "accepts function calls using @else if"
    },
    {
      code: "@if meta.type-of($item) == 'number' or list.index($values, $item) {}",
      description: "issue #578"
    },
    {
      code: "@if $type == 'map' and list.nth($token) == '%value' {}",
      description: "issue #578"
    }
  ],

  reject: [
    {
      code: "@if(true) {}",
      fixed: "@if true {}",
      line: 1,
      column: 4,
      endLine: 1,
      endColumn: 10,
      message: messages.rejected,
      description: "does not accept @if with parentheses"
    },
    {
      code: "@if (true) {}",
      fixed: "@if true {}",
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 11,
      message: messages.rejected,
      description: "fixes @if correctly, issue #887"
    },
    {
      code: "@while(true) {}",
      fixed: "@while true {}",
      line: 1,
      column: 7,
      endLine: 1,
      endColumn: 13,
      message: messages.rejected,
      description: "does not accept @while with parentheses"
    },
    {
      code: "@while (true) {}",
      fixed: "@while true {}",
      line: 1,
      column: 8,
      endLine: 1,
      endColumn: 14,
      message: messages.rejected,
      description: "fixes @while correctly, issue #887"
    },
    {
      code: `@if true {}
      @else if(true) {}`,
      fixed: `@if true {}
      @else if true {}`,
      message: messages.rejected,
      line: 2,
      column: 15,
      endLine: 2,
      endColumn: 21,
      description: "does not accept @else if with parentheses"
    },
    {
      code: `@if(true) {}
      @else if(true) {}`,
      fixed: `@if true {}
      @else if true {}`,
      warnings: [
        {
          message: messages.rejected,
          line: 1,
          column: 4,
          endLine: 1,
          endColumn: 10
        },
        {
          message: messages.rejected,
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 21
        }
      ],
      description: "fixes @else if correctly, issue #887"
    },
    {
      code: "@if (meta.type-of($item) == 'number') or list.index($values, $item) {}",
      fixed:
        "@if meta.type-of($item) == 'number' or list.index($values, $item) {}",
      message: messages.rejected,
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 68,
      description: "issue #578"
    },
    {
      code: "@if ($type == 'map') and (list.nth($token) == '%value') {}",
      fixed: "@if $type == 'map' and list.nth($token) == '%value' {}",
      message: messages.rejected,
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 56,
      description: "issue #578"
    },
    {
      code: "@if ($foo == 'x') or ($foo == 'y') {}",
      fixed: "@if $foo == 'x' or $foo == 'y' {}",
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 35,
      message: messages.rejected,
      description: "issue #578"
    },
    {
      code: "@if ($foo == 'x') and not ($foo == 'y') {}",
      fixed: "@if $foo == 'x' and not $foo == 'y' {}",
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 40,
      message: messages.rejected,
      description: "issue #578"
    },
    {
      code: "@if ($foo == 'x') or not ($foo == 'y') {}",
      fixed: "@if $foo == 'x' or not $foo == 'y' {}",
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 39,
      message: messages.rejected,
      description: "issue #578"
    }
  ]
});
