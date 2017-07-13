import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",

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
      line: 2,
      message: messages.expected,
      description: "Newline after function name"
    },
    {
      code: `
      @function foo($n) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "No space before parentheses."
    },
    {
      code: `
      @function  foo($n) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "Too many spaces before parentheses."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",

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
      line: 2,
      message: messages.rejected,
      description: "Newline after function name"
    },
    {
      code: `
      @function foo ($n) {
      }
    `,
      line: 2,
      message: messages.rejected,
      description: "Single space before parentheses."
    },
    {
      code: `
      @function foo  ($n) {
      }
    `,
      line: 2,
      message: messages.rejected,
      description: "Multiple spaces before parentheses."
    }
  ]
});
