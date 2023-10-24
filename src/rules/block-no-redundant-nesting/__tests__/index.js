"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: true,
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
        .foo .bar {}
        .foo-bar {}
        .foo {
          color: red;
        }
      `,
      description: "no nesting"
    },
    {
      code: `
        .foo {
          .bar {}
          &-baz {}
        }
      `,
      description: "multiple child blocks"
    },
    {
      code: `
        .foo,
        .bar {
            &-baz {}
        }
      `,
      description: "multiple outer selectors"
    },
    {
      code: `
        .foo {
          .bar, .baz {}
        }
      `,
      description: "multiple inner selectors"
    },
    {
      code: `
        .foo {
            color: red;

            &-baz {}
        }
      `,
      description: "property and single child block"
    },
    {
      code: `
        .foo {
            &-baz {}

            @media (min-width: 10px) {}
        }
      `,
      description: "at-rule and single child block"
    },
    {
      code: `
        .foo {
          font: {
            size: 16px;
          }
        }
      `,
      description: "Sass' nested properties"
    }
  ],

  reject: [
    {
      code: `
        .foo {
          .bar {}
        }
      `,
      fixed: `
        .foo .bar {
        }
      `,
      description: "single child block without &-prefix",
      warnings: [
        {
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 18,
          message: messages.rejected
        }
      ]
    },
    {
      code: `
        .foo {
          &-bar {
            color: red;
          }
        }
      `,
      fixed: `
        .foo-bar {
            color: red
        }
      `,
      description: "single child block with &-prefix and property",
      warnings: [
        {
          line: 3,
          column: 11,
          endLine: 5,
          endColumn: 12,
          message: messages.rejected
        }
      ]
    },
    {
      code: `
        .foo:not(.bar, .baz) {
          .bar {}
        }
      `,
      fixed: `
        .foo:not(.bar, .baz) .bar {
        }
      `,
      description: "outer selector contains comma but is not a list",
      warnings: [
        {
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 18,
          message: messages.rejected
        }
      ]
    },
    {
      code: `
        .foo {
          .bar {}
        }
        .foo {
          &-bar {
            &-baz {
              color: red;
            }
          }
        }
      `,
      fixed: `
        .foo .bar {
        }
        .foo-bar-baz {
              color: red
        }
      `,
      description: "multiple single child blocks",
      warnings: [
        {
          line: 3,
          column: 11,
          endLine: 3,
          endColumn: 18,
          message: messages.rejected
        },
        {
          line: 6,
          column: 11,
          endLine: 10,
          endColumn: 12,
          message: messages.rejected
        },
        {
          line: 7,
          column: 13,
          endLine: 9,
          endColumn: 14,
          message: messages.rejected
        }
      ]
    }
  ]
});
