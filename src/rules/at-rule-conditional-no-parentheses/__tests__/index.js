"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",
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
    }
  ],

  reject: [
    {
      code: "@if(true) {}",
      fixed: "@if true {}",
      message: messages.rejected,
      description: "does not accept @if with parentheses"
    },
    {
      code: "@while(true) {}",
      fixed: "@while true {}",
      message: messages.rejected,
      description: "does not accept @while with parentheses"
    },
    {
      code: `@if true {}
      @else if(true) {}`,
      fixed: `@if true {}
      @else if true {}`,
      message: messages.rejected,
      description: "does not accept @else if with parentheses"
    }
  ]
});
