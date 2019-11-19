"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
      @mixin foo () {
      }
    `,
      description: "No params with parentheses."
    },
    {
      code: `
      @mixin foo {
      }
    `,
      description: "No params without parentheses."
    },
    {
      code: `
      @mixin foo ($links: 10){
      }
    `,
      description: "With default params."
    },
    {
      code: `
      @mixin foo ($n) {
      }
    `,
      description: "With params."
    },
    {
      code: `
      @mixin  foo ($n) {
      }
    `,
      description: "Extra spaces after @mixin."
    },
    {
      code: `
      @bar foo ($n) {
      }
    `,
      description: "Not a SCSS mixin, skipping."
    },
    {
      code: `
      @mixin foo-bar () {
      }
    `,
      description: "No params with parentheses, hyphenated name."
    }
  ],

  reject: [
    {
      code: `
      @mixin
      foo
      ($n) {
      }
    `,
      fixed: `
      @mixin
      foo ($n) {
      }
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "Newline after mixin name"
    },
    {
      code: `
      @mixin foo($n) {
      }
    `,
      fixed: `
      @mixin foo ($n) {
      }
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "No space before parentheses."
    },
    {
      code: `
      @mixin  foo($n) {
      }
    `,
      fixed: `
      @mixin  foo ($n) {
      }
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "Extra spaces after @mixin."
    },
    {
      code: `
      @mixin foo-bar($n) {
      }
    `,
      fixed: `
      @mixin foo-bar ($n) {
      }
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "No space before parentheses, hyphenated name."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
      @mixin foo() {
      }
    `,
      description: "No params with parentheses."
    },
    {
      code: `
      @mixin foo {
      }
    `,
      description: "No params without parentheses."
    },
    {
      code: `
      @mixin foo($links: 10){
      }
    `,
      description: "With default params."
    },
    {
      code: `
      @mixin foo($n) {
      }
    `,
      description: "With params."
    },
    {
      code: `
      @mixin  foo($n) {
      }
    `,
      description: "Extra spaces after @mixin."
    },
    {
      code: `
      @bar foo($n) {
      }
    `,
      description: "Not a SCSS mixin, skipping."
    },
    {
      code: `
      @mixin foo-bar() {
      }
    `,
      description: "No params with parentheses, hyphenated name."
    }
  ],

  reject: [
    {
      code: `
      @mixin
      foo
      ($n) {
      }
    `,
      fixed: `
      @mixin
      foo($n) {
      }
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Newline after mixin name"
    },
    {
      code: `
      @mixin foo ($n) {
      }
    `,
      fixed: `
      @mixin foo($n) {
      }
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Single space before parentheses."
    },
    {
      code: `
      @mixin foo  ($n) {
      }
    `,
      fixed: `
      @mixin foo($n) {
      }
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Multiple spaces before parentheses."
    },
    {
      code: `
      @mixin foo-bar ($n) {
      }
    `,
      fixed: `
      @mixin foo-bar($n) {
      }
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Single space before parentheses, hyphenated name."
    }
  ]
});
