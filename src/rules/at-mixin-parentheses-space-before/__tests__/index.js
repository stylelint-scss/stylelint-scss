import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",

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
      line: 2,
      message: messages.expectedBefore(),
      description: "Newline after mixin name"
    },
    {
      code: `
      @mixin foo($n) {
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
      line: 2,
      message: messages.expectedBefore(),
      description: "Extra spaces after @mixin."
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
      line: 2,
      message: messages.rejectedBefore(),
      description: "Newline after mixin name"
    },
    {
      code: `
      @mixin foo ($n) {
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
      line: 2,
      message: messages.rejectedBefore(),
      description: "Multiple spaces before parentheses."
    }
  ]
});
