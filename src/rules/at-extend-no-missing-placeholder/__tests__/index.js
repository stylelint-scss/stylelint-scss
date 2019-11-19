"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
      p {
        @extend %placeholder;
      }
    `,
      description: "when extending with a placeholder"
    },
    {
      code: `
      p {
        @extend #{$dynamically_generated_placeholder_name};
      }
    `,
      description: "when extending with a dynamic selector"
    },
    {
      code: `
      p {
        @extend %foo-#{$dynamically_generated_placeholder_name};
      }
    `,
      description:
        "when extending with a dynamic selector whose prefix is a placeholder"
    }
  ],

  reject: [
    {
      code: `
      p {
        @extend span;
      }
    `,
      line: 3,
      message: messages.rejected,
      description: "when extending with an element"
    },
    {
      code: `
      p {
        @extend #some-identifer;
      }
    `,
      line: 3,
      message: messages.rejected,
      description: "when extending with an id"
    },
    {
      code: `
      p {
        @extend .some-class;
      }
    `,
      line: 3,
      message: messages.rejected,
      description: "when extending with a class"
    },
    {
      code: `
      p {
        @extend .blah-#{$dynamically_generated_name};
      }
    `,
      line: 3,
      message: messages.rejected,
      description:
        "when extending with a dyncamic selector whose prefix is not a placeholder"
    }
  ]
});
