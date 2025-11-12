"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: ".foo { --size: #{$base-margin}; }",
      description: "Properly interpolated variable in custom property"
    },
    {
      code: ".foo { --size: calc(0.5 * #{$base-margin}); }",
      description:
        "Properly interpolated variable in calc within custom property"
    },
    {
      code: ".foo { --size: var(--base-margin); }",
      description: "Custom property with only CSS var"
    },
    {
      code: ".foo { --size: 20px; }",
      description: "Custom property with plain values"
    },
    {
      code: ".foo { --size: calc(#{$var1} + #{$var2}); }",
      description: "Multiple properly interpolated variables in custom property"
    },
    {
      code: ".foo { margin: $base-margin; }",
      description: "Regular property with SCSS variable (not custom property)"
    },
    {
      code: ".foo { margin: calc(100% - $base-margin); }",
      description:
        "Regular property with calc and SCSS variable (not custom property)"
    },
    {
      code: ".foo { --size: #{abs($i)}; }",
      description: "Variable inside interpolation block"
    },
    {
      code: ".foo { --font-size: #{calculate-scale($i)}; }",
      description: "Variable inside function call within interpolation block"
    },
    {
      code: ".foo { --size: #{abs($i)} #{other($j)}; }",
      description: "Multiple interpolation blocks with variables"
    },
    {
      code: ".foo { --size: #{max(abs($i), 10)}; }",
      description: "Nested functions with variable in interpolation block"
    },
    {
      code: dedent`
        @for $i from -3 through -1 {
          --font-size-minus-#{abs($i)}: #{calculate-scale($i)};
        }
      `,
      description: "Real-world @for loop case"
    }
  ],

  reject: [
    {
      code: ".foo { --size: $base-margin; }",
      fixed: ".foo { --size: #{$base-margin}; }",
      description: "Simple custom property with variable",
      message: messages.expected("$base-margin"),
      line: 1,
      column: 16
    },
    {
      code: ".foo { --size: calc(100% - $base-margin); }",
      fixed: ".foo { --size: calc(100% - #{$base-margin}); }",
      description: "Custom property with calc and variable",
      message: messages.expected("$base-margin"),
      line: 1,
      column: 28
    },
    {
      code: ".foo { --size: calc(var(--base) / $font-scale); }",
      fixed: ".foo { --size: calc(var(--base) / #{$font-scale}); }",
      description: "Custom property with CSS var and SCSS variable",
      message: messages.expected("$font-scale"),
      line: 1,
      column: 35
    },
    {
      code: ".foo { --size: calc($var1 + $var2); }",
      fixed: ".foo { --size: calc(#{$var1} + #{$var2}); }",
      description: "Multiple SCSS variables in one custom property",
      messages: [messages.expected("$var1"), messages.expected("$var2")],
      warnings: [
        {
          message: messages.expected("$var1"),
          line: 1,
          column: 21
        },
        {
          message: messages.expected("$var2"),
          line: 1,
          column: 29
        }
      ]
    },
    {
      code: ".foo { --width: $base-width; }",
      fixed: ".foo { --width: #{$base-width}; }",
      description: "Variable with hyphen in custom property",
      message: messages.expected("$base-width"),
      line: 1,
      column: 17
    },
    {
      code: ".foo { --width: $base_width; }",
      fixed: ".foo { --width: #{$base_width}; }",
      description: "Variable with underscore in custom property",
      message: messages.expected("$base_width"),
      line: 1,
      column: 17
    },
    {
      code: ".foo { --size: calc(0.5 * $base-margin); }",
      fixed: ".foo { --size: calc(0.5 * #{$base-margin}); }",
      description: "Variable with arithmetic in custom property",
      message: messages.expected("$base-margin"),
      line: 1,
      column: 27
    },
    {
      code: ".foo { --size: calc(var(--base) / $factor); }",
      fixed: ".foo { --size: calc(var(--base) / #{$factor}); }",
      description: "CSS var with SCSS variable",
      message: messages.expected("$factor"),
      line: 1,
      column: 35
    },
    {
      code: ".foo { --size: calc( $base-margin ); }",
      fixed: ".foo { --size: calc( #{$base-margin} ); }",
      description: "Variable with spaces in custom property",
      message: messages.expected("$base-margin"),
      line: 1,
      column: 22
    },
    {
      code: ".foo { --size: $naked #{wrapped($inside)}; }",
      fixed: ".foo { --size: #{$naked} #{wrapped($inside)}; }",
      description: "Flag variables outside interpolation blocks but not inside",
      message: messages.expected("$naked"),
      line: 1,
      column: 16
    }
  ]
});
