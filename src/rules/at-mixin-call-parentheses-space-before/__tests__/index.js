"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @include foo ()
    `,
      description: "No params with parentheses."
    },
    {
      code: `
      @include foo
    `,
      description: "No params without parentheses."
    },
    {
      code: `
      @include foo ($links: 10)
    `,
      description: "With default params."
    },
    {
      code: `
      @include foo ($n)
    `,
      description: "With params."
    },
    {
      code: `
      @include  foo ($n)
    `,
      description: "Extra spaces after @include."
    },
    {
      code: `
      @bar foo ($n)
    `,
      description: "Not a SCSS include, skipping."
    },
    {
      code: `
      @include foo-bar ()
    `,
      description: "No params with parentheses, hyphenated name."
    }
  ],

  reject: [
    {
      code: `
      @include
      foo
      ($n)
    `,
      fixed: `
      @include
      foo ($n)
    `,
      line: 4,
      column: 7,
      endLine: 4,
      endColumn: 8,
      message: messages.expectedBefore(),
      description: "Newline after mixin name"
    },
    {
      code: `
      @include foo($n)
    `,
      fixed: `
      @include foo ($n)
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "No space before parentheses."
    },
    {
      code: `
      @include  foo($n)
    `,
      fixed: `
      @include  foo ($n)
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "Extra spaces after @include."
    },
    {
      code: `
      @include foo-bar($n)
    `,
      fixed: `
      @include foo-bar ($n)
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "No space before parentheses, hyphenated name."
    }
  ]
});

testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @include foo()
    `,
      description: "No params with parentheses."
    },
    {
      code: `
      @include foo
    `,
      description: "No params without parentheses."
    },
    {
      code: `
      @include foo($links: 10)
    `,
      description: "With default params."
    },
    {
      code: `
      @include foo($n)
    `,
      description: "With params."
    },
    {
      code: `
      @include  foo($n)
    `,
      description: "Extra spaces after @include."
    },
    {
      code: `
      @bar foo($n)
    `,
      description: "Not a SCSS include, skipping."
    },
    {
      code: `
      @include foo-bar()
    `,
      description: "No params with parentheses, hyphenated name."
    }
  ],

  reject: [
    {
      code: `
      @include
      foo
      ($n)
    `,
      fixed: `
      @include
      foo($n)
    `,
      line: 4,
      column: 7,
      endLine: 4,
      endColumn: 8,
      message: messages.rejectedBefore(),
      description: "Newline after mixin name"
    },
    {
      code: `
      @include foo ($n)
    `,
      fixed: `
      @include foo($n)
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Single space before parentheses."
    },
    {
      code: `
      @include foo  ($n)
    `,
      fixed: `
      @include foo($n)
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Multiple spaces before parentheses."
    },
    {
      code: `
      @include foo-bar ($n)
    `,
      fixed: `
      @include foo-bar($n)
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Single space before parentheses, hyphenated name."
    }
  ]
});
