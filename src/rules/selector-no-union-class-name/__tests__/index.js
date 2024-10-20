import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .class {
        &.foo {}
      }
    `,
      description: "when an ampersand is chained with another class name"
    },
    {
      code: `
      .class span {
        &-union {}
      }
    `,
      description: "when an ampersand parent is not class name"
    },
    {
      code: `
      .class {
        & span {}
      }
    `,
      description: "when an ampersand is chained with combinator"
    },
    {
      code: `
      .class {
        & + span {}
      }
    `,
      description:
        "when an ampersand is chained with the adjacent sibling combinator"
    },
    {
      code: `
      .class {
        & ~ span {}
      }
    `,
      description:
        "when an ampersand is chained with the general sibling combinator"
    },
    {
      code: `
      .class {
        & > span {}
      }
    `,
      description: "when an ampersand is chained with the child combinator "
    },
    {
      code: `
      .class {
        &:last-child {
          margin-left: 0.75rem;
        }
      }
      `,
      description: "ignores an ampersand chained with a pseudo-class"
    },
    {
      code: `
      .class {
        &::after {
          margin-left: 0.75rem;
        }
      }
      `,
      description: "ignores an ampersand chained with a pseudo-element"
    },
    {
      code: `
      .class {
        &#divID {
          margin-left: 0.75rem;
        }
      }
      `,
      description: "ignores an ampersand chained with an ID"
    },
    {
      code: `
      .class {
        &[title] {
          margin-left: 0.75rem;
        }
      }
      `,
      description: "ignores an ampersand chained with an attribute"
    },
    {
      code: `
      @mixin demo() {
        @content;
      }
      .a-selector {
        @include demo() {
          button:hover & {
  	        background:purple
          }
        }
      }`,
      description: "should not throw an error when using nesting (issue #345)"
    }
  ],

  reject: [
    {
      code: `
      .class {
        &-union {}
      }
    `,
      line: 3,
      column: 9,
      endLine: 3,
      endColumn: 16,
      message: messages.rejected,
      description: "when an ampersand is chained with union class name (hyphen)"
    },
    {
      code: `
			.class {
				&_union {}
			}
			`,
      line: 3,
      message: messages.rejected,
      description:
        "when an ampersand is chained with union class name (underscore)"
    },
    {
      code: `
			.class {
				&union {}
			}
			`,
      line: 3,
      message: messages.rejected,
      description: "when an ampersand is chained with union class name (direct)"
    }
  ]
});

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-less",

  /* eslint-disable no-useless-escape */
  accept: [
    {
      code: `
      .select {
        &::after,
        .@{select-prefix-cls}-selection-item::after,
        .@{select-prefix-cls}-selection-placeholder::after {
          display: inline-block;
          width: 0;
          visibility: hidden;
          content: '\a0';
        }
      }
      `,
      description:
        "verify that the selector parsing does not throw an error when Less is used (issue #471)."
    }
  ]
  /* eslint-enable no-useless-escape */
});
