import rule from "../index.js";

const { ruleName, messages } = rule;

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
      description: "No parens; space after mixin name in a call."
    },
    {
      code: `
        @include foo;
      `,
      description: "No parens; no space after mixin name in a call."
    },
    {
      code: `
        @include foo using ($argument) ;
      `,
      description:
        "No parens with content block arguments; space after mixin call."
    },
    {
      code: `
        @include foo using($argument) ;
      `,
      description:
        "No parens with content block arguments; no space after 'using', space after mixin call."
    },
    {
      code: `
        @include foo using ($argument);
      `,
      description:
        "No parens with content block arguments; no space after mixin call."
    },
    {
      code: `
        @include foo using($argument);
      `,
      description:
        "No parens with content block arguments; no space after 'using', no space after mixin call."
    },
    {
      code: `
        @include foo ("()") ;
      `,
      description:
        "With parens and arguments, '()' as an argument; space after mixin call."
    },
    {
      code: `
        @include foo ("()") using ($argument) ;
      `,
      description:
        "With parens, arguments and content block arguments, '()' as an argument; space after mixin call."
    },
    {
      code: `
        @include foo ("()") using($argument) ;
      `,
      description:
        "With parens, arguments and content block arguments, '()' as an argument; no space after 'using', space after mixin call."
    },
    // Special tests for mixin names containing "using"
    {
      code: `
        @include using using ($argument);
      `,
      description:
        "No parens with content block arguments; mixin name is 'using'."
    },
    {
      code: `
        @include focusing using ($argument);
      `,
      description:
        "No parens with content block arguments; mixin name contains 'using'."
    },
    {
      code: `
        @include using ("()") using ($argument);
      `,
      description:
        "With parens, arguments and content block arguments, '()' as an argument; mixin name is 'using'."
    },
    {
      code: `
        @include focusing ("()") using ($argument);
      `,
      description:
        "With parens, arguments and content block arguments, '()' as an argument; mixin name contains 'using'."
    }
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
      column: 18,
      endLine: 2,
      endColumn: 21,
      message: messages.rejected("foo"),
      description: "With parens, no space between them."
    },
    {
      code: `
        @include foo () using ($argument) ;
      `,
      fixed: `
        @include foo using ($argument) ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 21,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; no space between parens."
    },
    {
      code: `
        @include foo () using($argument) ;
      `,
      fixed: `
        @include foo using($argument) ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 21,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; no space between parens, no space after 'using'."
    },
    {
      code: `
        @include foo ()using($argument) ;
      `,
      fixed: `
        @include foo using($argument) ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 21,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; no space between parens, no space around 'using'."
    },
    {
      code: `
        @include foo()using($argument) ;
      `,
      fixed: `
        @include foo using($argument) ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 21,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; no space before parens, no space after parens, no space around 'using'."
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
      description: "With parens, space between them."
    },
    {
      code: `
        @include foo ( ) using ($argument) ;
      `,
      fixed: `
        @include foo using ($argument) ;
      `,
      line: 2,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; space between parens, space after 'using'."
    },
    {
      code: `
        @include foo ( ) using($argument) ;
      `,
      fixed: `
        @include foo using($argument) ;
      `,
      line: 2,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; space between parens, no space after 'using'."
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
      description: "With parens, no space before and space between them."
    },
    {
      code: `
        @include foo( ) using ($argument) ;
      `,
      fixed: `
        @include foo using ($argument) ;
      `,
      line: 2,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; no space before and space between parens, space after 'using'."
    },
    {
      code: `
        @include foo( ) using($argument) ;
      `,
      fixed: `
        @include foo using($argument) ;
      `,
      line: 2,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; no space before and space between parens, no space after 'using'."
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
      description: "With parens, newline between them."
    },
    {
      code: `
        @include foo(
        ) using ($argument) ;
      `,
      fixed: `
        @include foo using ($argument) ;
      `,
      line: 2,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; newline between parens, space after 'using'."
    },
    {
      code: `
        @include foo(
        ) using($argument) ;
      `,
      fixed: `
        @include foo using($argument) ;
      `,
      line: 2,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; newline between parens, no space after 'using'."
    },
    {
      code: `
        @include foo(
        )using($argument) ;
      `,
      fixed: `
        @include foo using($argument) ;
      `,
      line: 2,
      message: messages.rejected("foo"),
      description:
        "With parens and content block arguments; newline between parens, no space around 'using'."
    },
    // Special tests for mixin names containing "using"
    {
      code: `
        @include using () ;
      `,
      fixed: `
        @include using ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 23,
      message: messages.rejected("using"),
      description: "With parens, no space between them; mixin name is 'using'."
    },
    {
      code: `
        @include using () using ($argument) ;
      `,
      fixed: `
        @include using using ($argument) ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 23,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; no space between parens, space after 'using', mixin name is 'using'."
    },
    {
      code: `
        @include using () using($argument) ;
      `,
      fixed: `
        @include using using($argument) ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 23,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; no space between parens, no space after 'using', mixin name is 'using'."
    },
    {
      code: `
        @include using ()using($argument) ;
      `,
      fixed: `
        @include using using($argument) ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 23,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; no space between parens, no space around 'using', mixin name is 'using'."
    },
    {
      code: `
        @include using()using($argument) ;
      `,
      fixed: `
        @include using using($argument) ;
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 23,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; no space before parens, no space after parens, no space around 'using', mixin name is 'using'."
    },
    {
      code: `
        @include using ( ) ;
      `,
      fixed: `
        @include using ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description: "With parens, space between them; mixin name is 'using'."
    },
    {
      code: `
        @include using ( ) using ($argument) ;
      `,
      fixed: `
        @include using using ($argument) ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; space between parens, mixin name is 'using'."
    },
    {
      code: `
        @include using ( ) using($argument) ;
      `,
      fixed: `
        @include using using($argument) ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; space between parens, no space after 'using', mixin name is 'using'."
    },
    {
      code: `
        @include using( ) ;
      `,
      fixed: `
        @include using ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description:
        "With parens, no space before and space between them; mixin name is 'using'."
    },
    {
      code: `
        @include using( ) using ($argument) ;
      `,
      fixed: `
        @include using using ($argument) ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; no space before and space between parens, space after 'using', mixin name is 'using'."
    },
    {
      code: `
        @include using( ) using($argument) ;
      `,
      fixed: `
        @include using using($argument) ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; no space before and space between parens, no space after 'using', mixin name is 'using'."
    },
    {
      code: `
        @include using(
        ) ;
      `,
      fixed: `
        @include using ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description: "With parens, newline between them; mixin name is 'using'."
    },
    {
      code: `
        @include using(
        ) using ($argument) ;
      `,
      fixed: `
        @include using using ($argument) ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; newline between parens, space after 'using', mixin name is 'using'."
    },
    {
      code: `
        @include using(
        ) using($argument) ;
      `,
      fixed: `
        @include using using($argument) ;
      `,
      line: 2,
      message: messages.rejected("using"),
      description:
        "With parens and content block arguments; newline between parens, no space after 'using', mixin name is 'using'."
    }
  ]
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
      description: "With parens, no space between them."
    },
    {
      code: `
        @include foo () using ($argument);
      `,
      description:
        "With parens and content block arguments; no space between parens, space after 'using'."
    },
    {
      code: `
        @include foo () using($argument);
      `,
      description:
        "With parens and content block arguments; no space between parens, no space after 'using'."
    },
    {
      code: `
        @include foo ()using($argument);
      `,
      description:
        "With parens and content block arguments; no space between parens, no space around 'using'."
    },
    {
      code: `
        @include foo ( );
      `,
      description: "With parens, space between them."
    },
    {
      code: `
        @include foo ( ) using ($argument);
      `,
      description:
        "With parens and content block arguments; space between parens, space after 'using'."
    },
    {
      code: `
        @include foo ( ) using($argument);
      `,
      description:
        "With parens and content block arguments; space between parens, no space after 'using'."
    },
    {
      code: `
        @include foo( 10)
      `,
      description: "With parens, no space before and space between them."
    },
    {
      code: `
        @include foo( 10) using ($argument)
      `,
      description:
        "With parens and content block arguments; no space before and space between parens, space after 'using'."
    },
    {
      code: `
        @include foo( 10) using($argument)
      `,
      description:
        "With parens and content block arguments; no space before and space between parens, no space after 'using'."
    },
    {
      code: `
        @include foo
        (10)
      `,
      description: "With parens, newline before them."
    },
    {
      code: `
        @include foo
        (10) using ($argument)
      `,
      description:
        "With parens and content block arguments; newline before parens."
    },
    {
      code: `
        @include foo
        (10)
        using ($argument)
      `,
      description:
        "With parens and content block arguments; newline before parens, newline before 'using'."
    },
    {
      code: `
        @include foo
        (10) using($argument)
      `,
      description:
        "With parens and content block arguments; newline before parens, no space after 'using'."
    },
    {
      code: `
        @include foo
        (10)
        using($argument)
      `,
      description:
        "With parens and content block arguments; newline before parens, newline before 'using', no space after 'using'."
    }
  ],

  reject: [
    {
      code: `
        @include foo;
      `,
      fixed: `
        @include foo();
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 21,
      message: messages.expected("foo"),
      description: "No parens."
    },
    {
      code: `
        @include foo ;
      `,
      fixed: `
        @include foo() ;
      `,
      line: 2,
      message: messages.expected("foo"),
      description: "No parens; space after mixin name in a call."
    },
    {
      code: `
        @include foo
      `,
      fixed: `
        @include foo()
      `,
      line: 2,
      message: messages.expected("foo"),
      description: "No parens; no trailing semicolon."
    },
    {
      code: `
        @include foo using ($argument);
      `,
      fixed: `
        @include foo() using ($argument);
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 21,
      message: messages.expected("foo"),
      description:
        "No parens with content block arguments; space after 'using'."
    },
    {
      code: `
        @include foo using($argument);
      `,
      fixed: `
        @include foo() using($argument);
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 21,
      message: messages.expected("foo"),
      description:
        "No parens with content block arguments; no space after 'using'."
    },
    {
      code: `
        @include foo using ($argument) ;
      `,
      fixed: `
        @include foo() using ($argument) ;
      `,
      line: 2,
      message: messages.expected("foo"),
      description:
        "No parens with content block arguments; space after mixin call, space after 'using'."
    },
    {
      code: `
        @include foo using($argument) ;
      `,
      fixed: `
        @include foo() using($argument) ;
      `,
      line: 2,
      message: messages.expected("foo"),
      description:
        "No parens with content block arguments; space after mixin call, no space after 'using'."
    },
    {
      code: `
        @include foo using ($argument)
      `,
      fixed: `
        @include foo() using ($argument)
      `,
      line: 2,
      message: messages.expected("foo"),
      description:
        "No parens with content block arguments; space after 'using', no trailing semicolon."
    },
    {
      code: `
        @include foo using($argument)
      `,
      fixed: `
        @include foo() using($argument)
      `,
      line: 2,
      message: messages.expected("foo"),
      description:
        "No parens with content block arguments; no space after 'using', no trailing semicolon."
    },
    // Special tests for mixin names containing "using"
    {
      code: `
        @include using;
      `,
      fixed: `
        @include using();
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 23,
      message: messages.expected("using"),
      description: "No parens, mixin name is 'using'."
    },
    {
      code: `
        @include focusing;
      `,
      fixed: `
        @include focusing();
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 26,
      message: messages.expected("focusing"),
      description: "No parens, mixin name contains 'using'."
    },
    {
      code: `
        @include using ;
      `,
      fixed: `
        @include using() ;
      `,
      line: 2,
      message: messages.expected("using"),
      description:
        "No parens; space after mixin name in a call, mixin name is 'using'."
    },
    {
      code: `
        @include focusing ;
      `,
      fixed: `
        @include focusing() ;
      `,
      line: 2,
      message: messages.expected("focusing"),
      description:
        "No parens; space after mixin name in a call, mixin name contains 'using'."
    },
    {
      code: `
        @include using
      `,
      fixed: `
        @include using()
      `,
      line: 2,
      message: messages.expected("using"),
      description: "No parens; no trailing semicolon, mixin name is 'using'."
    },
    {
      code: `
        @include focusing
      `,
      fixed: `
        @include focusing()
      `,
      line: 2,
      message: messages.expected("focusing"),
      description:
        "No parens; no trailing semicolon, mixin name contains 'using'."
    },
    {
      code: `
        @include using using ($argument);
      `,
      fixed: `
        @include using() using ($argument);
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 23,
      message: messages.expected("using"),
      description:
        "No parens with content block arguments; mixin name is 'using', space after 'using'."
    },
    {
      code: `
        @include using using($argument);
      `,
      fixed: `
        @include using() using($argument);
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 23,
      message: messages.expected("using"),
      description:
        "No parens with content block arguments; mixin name is 'using', no space after 'using'."
    },
    {
      code: `
        @include focusing using ($argument);
      `,
      fixed: `
        @include focusing() using ($argument);
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 26,
      message: messages.expected("focusing"),
      description:
        "No parens with content block arguments; mixin name contains 'using', space after 'using'."
    },
    {
      code: `
        @include focusing using($argument);
      `,
      fixed: `
        @include focusing() using($argument);
      `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 26,
      message: messages.expected("focusing"),
      description:
        "No parens with content block arguments; mixin name contains 'using', no space after 'using'."
    }
  ]
});
