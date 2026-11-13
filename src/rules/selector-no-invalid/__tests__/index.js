import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],

  accept: [
    { code: "a {}" },
    { code: "a > b, c + d ~ e {}" },
    { code: "a:has(> b) {}" },
    { code: "a:not(.b, .c) {}" },
    { code: "a::before:hover {}" },
    { code: "a::part(x)::before {}" },
    { code: "a::after::marker {}" },
    { code: "a:dir(rtl) {}" },
    { code: "a:host(.b) {}" },
    { code: "a /* comment */ b {}" },
    { code: "a[href^='http://example.com'] {}" },
    {
      code: "@keyframes k { from {} 50% {} }",
      description: "keyframe selectors"
    },
    {
      code: "@-webkit-keyframes k { 50% {} }",
      description: "prefixed keyframe selectors"
    },
    {
      code: "a { & + & {} }",
      description: "native nesting selector"
    },
    {
      code: "a { &::before b {} }",
      description: "combinator after a pseudo-element with nesting selector"
    }
  ],

  reject: [
    {
      code: "a,, b {}",
      message: messages.rejected("a,, b", "selector is expected"),
      line: 1,
      column: 3,
      endLine: 1,
      endColumn: 4
    },
    {
      code: "a[x=] {}",
      message: messages.rejected("a[x=]", "identifier is expected"),
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 6
    },
    {
      code: "a:has(:has(b)) {}",
      message: messages.rejected(
        "a:has(:has(b))",
        '":has()" is invalid within ":has()"'
      ),
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 15
    },
    {
      code: "a:not(::before) {}",
      message: messages.rejected(
        "a:not(::before)",
        'pseudo-elements are invalid within ":not()"'
      ),
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 16
    },
    {
      code: "a:host(.b .c) {}",
      message: messages.rejected(
        "a:host(.b .c)",
        'combinators are invalid within ":host()"'
      ),
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 14
    },
    {
      code: "a::before b {}",
      message: messages.rejected(
        "a::before b",
        'combinators are invalid after "::before"'
      ),
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 12
    },
    {
      code: "a::before::after {}",
      message: messages.rejected(
        "a::before::after",
        '"::after" is invalid after "::before"'
      ),
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 17
    },
    {
      code: "a:dir(up) {}",
      message: messages.rejected(
        "a:dir(up)",
        'expected "ltr" or "rtl" within ":dir()"'
      ),
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 10
    },
    {
      code: "b, a::before c {}",
      message: messages.rejected(
        "a::before c",
        'combinators are invalid after "::before"'
      ),
      description: "reports only the invalid selector of a list",
      line: 1,
      column: 4,
      endLine: 1,
      endColumn: 15
    }
  ]
});

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: ".a { &-b {} }",
      description: "parent selector suffix"
    },
    {
      code: ".a { &__b--c {} }",
      description: "BEM parent selector suffix"
    },
    {
      code: ".a { &-1 {} }",
      description: "numeric parent selector suffix"
    },
    {
      code: ".a { &1 {} }",
      description: "parent selector suffix starting with a digit"
    },
    {
      code: ".a { &-1:hover {} }",
      description: "numeric parent selector suffix with a pseudo-class"
    },
    {
      code: ".a { :not(&-1) {} }",
      description: "parent selector suffix within a pseudo-class"
    },
    {
      code: "@include m { &-1 {} }",
      description: "parent selector suffix within a mixin content block"
    },
    {
      code: "%placeholder {}",
      description: "placeholder selector"
    },
    {
      code: ".a %placeholder-1 {}",
      description: "placeholder selector after a combinator"
    },
    {
      code: ".a:not(%placeholder) {}",
      description: "placeholder selector within a pseudo-class"
    },
    {
      code: ".a { @at-root %placeholder {} }",
      description: "placeholder selector within @at-root"
    },
    {
      code: ".a-#{$b} {}",
      description: "interpolation"
    },
    {
      code: "@each $i in 1, 2 { .a-#{$i}::before b {} }",
      description: "interpolation is ignored"
    },
    {
      code: `
      .a,
      // it's a comment
      .b {}
    `,
      description: "inline comment"
    },
    {
      code: ".a /* % & // */ .b {}",
      description: "Sass syntax within a block comment"
    },
    {
      code: ".a { font: { family: serif; } }",
      description: "nested properties"
    }
  ],

  reject: [
    {
      code: "% {}",
      message: messages.rejected("%", "selector is expected"),
      description: "placeholder selector without a name",
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 2
    },
    {
      code: "%placeholder::before .a {}",
      message: messages.rejected(
        "%placeholder::before .a",
        'combinators are invalid after "::before"'
      ),
      description: "placeholder selector",
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 24
    },
    {
      code: ".a { &-1:dir(up) {} }",
      message: messages.rejected(
        "&-1:dir(up)",
        'expected "ltr" or "rtl" within ":dir()"'
      ),
      description: "numeric parent selector suffix",
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 17
    },
    {
      code: ".a { &-b, b::before c {} }",
      message: messages.rejected(
        "b::before c",
        'combinators are invalid after "::before"'
      ),
      description: "reports the source selector, not the rewritten one",
      line: 1,
      column: 11,
      endLine: 1,
      endColumn: 22
    },
    {
      code: `
      .a, // comment
      b:has(:has(c)) {}
    `,
      message: messages.rejected(
        "b:has(:has(c))",
        '":has()" is invalid within ":has()"'
      ),
      description: "after an inline comment",
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 21
    }
  ]
});
