import testRule from "stylelint-test-rule-tape";
import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
      @include foo {
      }
    `,
      description: "No parens; space after mixin name in a call."
    },
    {
      code: `
      @include foo{
      }
    `,
      description: "No parens; no space after mixin name in a call."
    },
    {
      code: `
      @include foo ("()") {
      }
    `,
      description: "With parens and arguments, '()' as ans argument."
    }
  ],

  reject: [
    {
      code: `
      @include foo () {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "With parens, no space between them."
    },
    {
      code: `
      @include foo ( ) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "With parens, space between them"
    },
    {
      code: `
      @include foo( ) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "With parens, no space before and space between them"
    },
    {
      code: `
      @include foo(
      ) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "With parens, newline between them"
    }
  ]
});
