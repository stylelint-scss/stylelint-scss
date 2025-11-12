"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: "a { --foo: #{$bar}; }",
      description: "Properly interpolated variable in custom property"
    },
    {
      code: "a { --foo: calc(0.5 * #{$bar}); }",
      description:
        "Properly interpolated variable in calc within custom property"
    },
    {
      code: "a { --foo: var(--bar); }",
      description: "Custom property with only CSS var"
    },
    {
      code: "a { --foo: 20px; }",
      description: "Custom property with plain values"
    },
    {
      code: "a { --foo: calc(#{$bar} + #{$baz}); }",
      description: "Multiple properly interpolated variables in custom property"
    },
    {
      code: "a { color: $bar; }",
      description: "Regular property with SCSS variable (not custom property)"
    },
    {
      code: "a { color: calc(100% - $bar); }",
      description:
        "Regular property with calc and SCSS variable (not custom property)"
    },
    {
      code: "a { --foo: #{abs($i)}; }",
      description: "Variable inside interpolation block"
    },
    {
      code: "a { --foo: #{calculate-scale($i)}; }",
      description: "Variable inside function call within interpolation block"
    },
    {
      code: "a { --foo: #{abs($i)} #{other($j)}; }",
      description: "Multiple interpolation blocks with variables"
    },
    {
      code: "a { --foo: #{max(abs($i), 10)}; }",
      description: "Nested functions with variable in interpolation block"
    },
    {
      code: dedent`
        @for $i from -3 through -1 {
          --font-size-minus-#{abs($i)}: #{calculate-scale($i)};
        }
      `,
      description: "Real-world @for loop case"
    },
    {
      code: 'a { --foo: "string"; }',
      description: "CSS string without variable"
    },
    {
      code: 'a { --foo: "prefix-#{$var}-suffix"; }',
      description: "CSS string with interpolated variable"
    },
    {
      code: "a { --foo: /* comment */ 20px; }",
      description: "CSS comment in custom property value"
    },
    {
      code: "a { --foo: inherit; }",
      description: "CSS-wide keyword inherit"
    },
    {
      code: "a { --foo: initial; }",
      description: "CSS-wide keyword initial"
    },
    {
      code: "a { --foo: unset; }",
      description: "CSS-wide keyword unset"
    },
    {
      code: "a { --foo: url(#{$path}); }",
      description: "url() function with interpolated variable"
    }
  ],

  reject: [
    {
      code: "a { --foo: $bar; }",
      fixed: "a { --foo: #{$bar}; }",
      description: "Simple custom property with variable",
      message: messages.expected("$bar"),
      line: 1,
      column: 12
    },
    {
      code: "a { --foo: calc(100% - $bar); }",
      fixed: "a { --foo: calc(100% - #{$bar}); }",
      description: "Custom property with calc and variable",
      message: messages.expected("$bar"),
      line: 1,
      column: 24
    },
    {
      code: "a { --foo: calc(var(--bar) / $baz); }",
      fixed: "a { --foo: calc(var(--bar) / #{$baz}); }",
      description: "Custom property with CSS var and SCSS variable",
      message: messages.expected("$baz"),
      line: 1,
      column: 30
    },
    {
      code: "a { --foo: calc($bar + $baz); }",
      fixed: "a { --foo: calc(#{$bar} + #{$baz}); }",
      description: "Multiple SCSS variables in one custom property",
      messages: [messages.expected("$bar"), messages.expected("$baz")],
      warnings: [
        {
          message: messages.expected("$bar"),
          line: 1,
          column: 17
        },
        {
          message: messages.expected("$baz"),
          line: 1,
          column: 24
        }
      ]
    },
    {
      code: "a { --foo: $bar-baz; }",
      fixed: "a { --foo: #{$bar-baz}; }",
      description: "Variable with hyphen in custom property",
      message: messages.expected("$bar-baz"),
      line: 1,
      column: 12
    },
    {
      code: "a { --foo: $bar_baz; }",
      fixed: "a { --foo: #{$bar_baz}; }",
      description: "Variable with underscore in custom property",
      message: messages.expected("$bar_baz"),
      line: 1,
      column: 12
    },
    {
      code: "a { --foo: calc(0.5 * $bar); }",
      fixed: "a { --foo: calc(0.5 * #{$bar}); }",
      description: "Variable with arithmetic in custom property",
      message: messages.expected("$bar"),
      line: 1,
      column: 23
    },
    {
      code: "a { --foo: calc(var(--bar) / $baz); }",
      fixed: "a { --foo: calc(var(--bar) / #{$baz}); }",
      description: "CSS var with SCSS variable",
      message: messages.expected("$baz"),
      line: 1,
      column: 30
    },
    {
      code: "a { --foo: calc( $bar ); }",
      fixed: "a { --foo: calc( #{$bar} ); }",
      description: "Variable with spaces in custom property",
      message: messages.expected("$bar"),
      line: 1,
      column: 18
    },
    {
      code: "a { --foo: $bar #{wrapped($baz)}; }",
      fixed: "a { --foo: #{$bar} #{wrapped($baz)}; }",
      description: "Flag variables outside interpolation blocks but not inside",
      message: messages.expected("$bar"),
      line: 1,
      column: 12
    },
    {
      code: 'a { --foo: "string-$var"; }',
      fixed: 'a { --foo: "string-#{$var}"; }',
      description: "Variable inside CSS string literal",
      message: messages.expected("$var"),
      line: 1,
      column: 20
    },
    {
      code: "a { --foo: /* comment */ $var; }",
      fixed: "a { --foo: /* comment */ #{$var}; }",
      description: "Variable after CSS comment",
      message: messages.expected("$var"),
      line: 1,
      column: 26
    },
    {
      code: "a { --foo: url($path); }",
      fixed: "a { --foo: url(#{$path}); }",
      description: "Variable in url() function",
      message: messages.expected("$path"),
      line: 1,
      column: 16
    }
  ]
});
