import { ruleName, messages } from "..";

testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @include foo ;
    `,
      description: "No parens; space after mixin name in a call.",
    },
    {
      code: `
      @include foo;
    `,
      description: "No parens; no space after mixin name in a call.",
    },
    {
      code: `
      @include foo ("()") ;
    `,
      description: "With parens and arguments, '()' as ans argument.",
    },
  ],

  reject: [
    {
      code: `
      @include foo () ;
    `,
      fixed: `
      @include foo ;
    `,
      line: 2,
      message: messages.rejected("foo"),
      description: "With parens, no space between them.",
    },
    {
      code: `
      @include foo ( ) ;
    `,
      fixed: `
      @include foo ;
    `,
      line: 2,
      message: messages.rejected("foo"),
      description: "With parens, space between them",
    },
    {
      code: `
      @include foo( ) ;
    `,
      fixed: `
      @include foo ;
    `,
      line: 2,
      message: messages.rejected("foo"),
      description: "With parens, no space before and space between them",
    },
    {
      code: `
      @include foo(
      ) ;
    `,
      fixed: `
      @include foo ;
    `,
      line: 2,
      message: messages.rejected("foo"),
      description: "With parens, newline between them",
    },
  ],
});

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @include foo ();
    `,
      description: "With parens, no space between them.",
    },
    {
      code: `
      @include foo ( );
    `,
      description: "With parens, space between them",
    },
    {
      code: `
      @include foo( 10)
    `,
      description: "With parens, no space before and space between them",
    },
    {
      code: `
      @include foo
      (10)
    `,
      description: "With parens, newline between them",
    },
  ],

  reject: [
    {
      code: `
      @include foo;
    `,
      fixed: `
      @include foo ();
    `,
      line: 2,
      message: messages.expected("foo"),
      description: "No parens.",
    },
    {
      code: `
      @include foo ;
    `,
      fixed: `
      @include foo () ;
    `,
      line: 2,
      message: messages.expected("foo"),
      description: "No parens; a space after mixin name in a call.",
    },
    {
      code: `
      @include foo
    `,
      fixed: `
      @include foo ()
    `,
      line: 2,
      message: messages.expected("foo"),
      description: "No parens; no trailing semicolon.",
    },
  ],
});
