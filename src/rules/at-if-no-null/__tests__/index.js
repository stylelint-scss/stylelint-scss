import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `a {
      @if $x {}
    }`,
      description: "does not use the != null format"
    },
    {
      code: `a {
      @if not $x {}
    }`,
      description: "does not use the == null format"
    },
    {
      code: `a {
      @if $x != null and $x > 1 {}
    }`,
      description: "does not use the == null format"
    },
    {
      code: `a {
      @if $x!=null and $x > 1 {}
    }`,
      description: "!= null guard without spaces"
    },
    {
      code: `a {
      @if $x == nullable {}
    }`,
      description: "compares to an identifier starting with null"
    },
    {
      code: `a {
      @if $x == null-ish {}
    }`,
      description: "compares to a hyphenated identifier starting with null"
    },
    {
      code: `a {
      @if $x == "null" {}
    }`,
      description: "compares to the string null"
    },
    {
      code: `a {
      @if $x {}
      @else if not $y {}
    }`,
      description: "@else if without a null comparison"
    }
  ],

  reject: [
    {
      code: `a {
      @if $x == null {}
    }`,
      description: "uses the == null format",
      message: messages.equals_null,
      line: 2,
      column: 11,
      endLine: 2,
      endColumn: 21
    },
    {
      code: `a {
      @if $x != null {}
    }`,
      description: "uses the != null format",
      message: messages.not_equals_null,
      line: 2,
      column: 11,
      endLine: 2,
      endColumn: 21
    },
    {
      code: `a {
      @if $x==null {}
    }`,
      description: "uses the == null format without spaces",
      message: messages.equals_null,
      line: 2,
      column: 11,
      endLine: 2,
      endColumn: 19
    },
    {
      code: `a {
      @if $x !=null {}
    }`,
      description: "uses the != null format without a space after the operator",
      message: messages.not_equals_null,
      line: 2,
      column: 11,
      endLine: 2,
      endColumn: 20
    },
    {
      code: `a {
      @if $x {}
      @else if $y == null {}
    }`,
      description: "uses the == null format in @else if",
      message: messages.equals_null,
      line: 3,
      column: 16,
      endLine: 3,
      endColumn: 26
    },
    {
      code: `a {
      @if $x {}
      @else if $y != null {}
    }`,
      description: "uses the != null format in @else if",
      message: messages.not_equals_null,
      line: 3,
      column: 16,
      endLine: 3,
      endColumn: 26
    }
  ]
});
