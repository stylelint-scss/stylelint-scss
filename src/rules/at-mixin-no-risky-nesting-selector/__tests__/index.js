import rule from "../index.js";

const { ruleName } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .parent {
        color: blue;
    
        & .b {
          color: red;
        }
      }
    `,
      description: "Nested parent selector"
    },
    {
      code: `
      .parent {
        color: blue;
    
        & .b, &.context {
          color: red;
        }
      }
    `,
      description: "Nested parent selector in complex selector"
    },
    {
      code: `
      .bar {
        & .parent {
          color: blue;
      
          .context {
            color: red;
          }
        }
      }
    `,
      description: "Parent selector nested in another style rule"
    },
    {
      code: `
      @mixin foo {
        &.context {
          color: red;
        }
      }
    `,
      description: "Parent selector in mixin"
    },
    {
      code: `
      .bar {
        .parent {
          color: blue;
      
          & .context {
            color: red;
          }
        }
      }
    `,
      description: "Parent selector nested in more than one style rule"
    },
    {
      code: `
      .parent {
        color: blue;
    
        .context & {
          color: red;
        }
      }
    `,
      description: "Selector ending in parent selector"
    },
    {
      code: `
      .parent {
        color: blue;
    
        .context & .b {
          color: red;
        }
      }
    `,
      description: "Parent selector in the middle of complex selector"
    },
    {
      code: `
      .parent {
        color: blue;
    
        & .b, .context & {
          color: red;
        }
      }
    `,
      description: "Complex selector, one ending in parent selector"
    },
    {
      code: `
      @mixin foo {
        .parent {
          color: blue;
      
          & .context {
            color: red;
          }
        }
      }
    `,
      description: "Parent selector in mixin, nested, at the beginning"
    },
    {
      code: `
      @mixin foo {
        .bar & {
          color: red;
        }
      }
    `,
      description: "Parent selector in mixin, at the end"
    },
    {
      code: `
      @mixin foo {
        .parent {
          .bar, & {
            color: red;
          }
        }
      }
    `,
      description: "Complex selector in mixin, nested, no following class."
    },
    {
      code: `
      @mixin theme {
        .a {
          &:focus,
          &:hover {
            background-color: #0000;
          }
        }
      }
    `,
      description: "Complex selector in mixin, nested, no following class."
    }
  ],

  reject: [
    {
      code: `
      @mixin foo {
        .bar {
          color: blue;
          .baz & {
            color: red;
          }
        }
      }
    `,
      description: "Parent selector nested in selector within a mixin",
      message:
        "Unexpected nested parent selector in @mixin rule (scss/at-mixin-no-risky-nesting-selector)",
      column: 11,
      endColumn: 12,
      endLine: 7,
      line: 5
    },
    {
      code: `
      @mixin foo {
        .bar {
          color: blue;
          & .qux, .baz & .quux{
            color: red;
          }
        }
      }
    `,
      description: "Parent selector nested in complex selector within mixin",
      message:
        "Unexpected nested parent selector in @mixin rule (scss/at-mixin-no-risky-nesting-selector)",
      column: 11,
      endColumn: 12,
      endLine: 7,
      line: 5
    },
    {
      code: `
      @mixin foo {
        .bar {
          color: blue;
          & .qux & {
            color: red;
          }
        }
      }
    `,
      description: "Parent selector nested in complex selector within mixin",
      message:
        "Unexpected nested parent selector in @mixin rule (scss/at-mixin-no-risky-nesting-selector)",
      column: 11,
      endColumn: 12,
      endLine: 7,
      line: 5
    }
  ]
});
