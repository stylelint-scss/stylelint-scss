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
      @function foo () {
      }
    `,
      description: "No params."
    },
    {
      code: `
      @function foo ($links: 10){
      }
    `,
      description: "With default params."
    },
    {
      code: `
      @function foo ($n) {
      }
    `,
      description: "With params."
    },
    {
      code: `
      @function  foo ($n) {
      }
    `,
      description: "Extra spaces after @function."
    },
    {
      code: `
      @functio1n foo ($n) {
      }
    `,
      description: "Not a SCSS function, skipping."
    },
    {
      code: `
      @function foo-bar () {
      }
    `,
      description: "No params, hyphenated name."
    }
  ],

  reject: [
    {
      code: `
      @function
      foo
      ($n) {
      }
    `,
      fixed: `
      @function
      foo ($n) {
      }
    `,
      line: 4,
      column: 7,
      endLine: 4,
      endColumn: 8,
      message: messages.expectedBefore(),
      description: "Newline after function name"
    },
    {
      code: `
      @function foo($n) {
      }
    `,
      fixed: `
      @function foo ($n) {
      }
    `,
      line: 2,
      column: 20,
      endLine: 2,
      endColumn: 21,
      message: messages.expectedBefore(),
      description: "No space before parentheses."
    },
    {
      code: `
      @function  foo($n) {
      }
    `,
      fixed: `
      @function  foo ($n) {
      }
    `,
      line: 2,
      column: 21,
      endLine: 2,
      endColumn: 22,
      message: messages.expectedBefore(),
      description: "Extra spaces after @function."
    },
    {
      code: `
      @function foo-bar($n) {
      }
    `,
      fixed: `
      @function foo-bar ($n) {
      }
    `,
      line: 2,
      column: 24,
      endLine: 2,
      endColumn: 25,
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
      @function foo() {
      }
    `,
      description: "No params."
    },
    {
      code: `
      @function foo($links: 10){
      }
    `,
      description: "With default params."
    },
    {
      code: `
      @function foo($n) {
      }
    `,
      description: "With params."
    },
    {
      code: `
      @function  foo($n) {
      }
    `,
      description: "Extra spaces after @function."
    },
    {
      code: `
      @functio1n foo($n) {
      }
    `,
      description: "Not a SCSS function, skipping."
    },
    {
      code: `
      @function foo-bar() {
      }
    `,
      description: "No params, hyphenated name."
    }
  ],

  reject: [
    {
      code: `
      @function
      foo
      ($n) {
      }
    `,
      fixed: `
      @function
      foo($n) {
      }
    `,
      line: 4,
      column: 7,
      endLine: 4,
      endColumn: 8,
      message: messages.rejectedBefore(),
      description: "Newline after function name"
    },
    {
      code: `
      @function foo ($n) {
      }
    `,
      fixed: `
      @function foo($n) {
      }
    `,
      line: 2,
      column: 21,
      endLine: 2,
      endColumn: 22,
      message: messages.rejectedBefore(),
      description: "Single space before parentheses."
    },
    {
      code: `
      @function foo  ($n) {
      }
    `,
      fixed: `
      @function foo($n) {
      }
    `,
      line: 2,
      column: 22,
      endLine: 2,
      endColumn: 23,
      message: messages.rejectedBefore(),
      description: "Multiple spaces before parentheses."
    },
    {
      code: `
      @function foo-bar ($n) {
      }
    `,
      fixed: `
      @function foo-bar($n) {
      }
    `,
      line: 2,
      column: 25,
      endLine: 2,
      endColumn: 26,
      message: messages.rejectedBefore(),
      description: "Single space before parentheses, hyphenated name."
    }
  ]
});
