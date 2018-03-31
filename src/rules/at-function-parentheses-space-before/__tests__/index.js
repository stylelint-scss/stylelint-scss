import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
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
      line: 2,
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
      message: messages.expectedBefore(),
      description: "Extra spaces after @function."
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
      line: 2,
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
      message: messages.rejectedBefore(),
      description: "Multiple spaces before parentheses."
    }
  ]
});
