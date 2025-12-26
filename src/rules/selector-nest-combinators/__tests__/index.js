import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .foo {
        .bar {}
      }
      `,
      description: "when child combinators are nested"
    },
    {
      code: `
      .foo {
        &.bar {}
      }
      `,
      description: "when chained combinators are nested"
    },
    {
      code: `
      .foo {
        & > .bar {}
      }
      `,
      description: "when direct descendant combinators are nested"
    },
    {
      code: `
      .foo {
        & > {
          .bar {}
        }
      }
      `,
      description:
        "when direct descendant combinators are nested + a nested class"
    },
    {
      code: `
      .baz {
        .foo.bar & {}
      }
      `,
      description:
        "when chained combinators can't be nested due to preceding a parent selector"
    },
    {
      code: `
      .foo {
        &bar {
          &baz {}
        }
      }
      `,
      description: "when parent selectors are used for concatenation"
    },
    {
      code: `
      .foo {
        &__bar {
          &--baz {}
        }
      }
      `,
      description: "when parent selectors are used for BEM style concatenation"
    },
    {
      code: `
      .foo {
        &:hover {}
      }
      `,
      description: "when pseudo classes are nested"
    },
    {
      code: `
      .foo {
        &:nth-child(2n - 1) {}
      }
      `,
      description: "when an nth child selector is used which includes spaces"
    },
    {
      code: `
      [data-test="foo bar"] {}
      `,
      description: "when an attribute selector is used with spaces in it"
    },
    {
      code: `
      :not([class]:last-child) {}
      `,
      description: "when selectors are chained within a not selector"
    },
    {
      code: `
      .class-name {
	      #{if(&, "&", "")} {

	      }
      }
      `,
      description: "should support interpolation"
    },
    {
      code: `
      a {
        font: {
          size: 10px;
          weight: 400;
        }
      }
      `,
      description: "ignores nested properties"
    },
    {
      code: `
      @keyframes foo {
	      0% {
		      color: blue;
        }
        50.5% {
          color: red;
        }
      }
      `,
      description: "ignores @keyframes"
    }
  ],

  reject: [
    {
      code: `
      .foo .bar {}
      `,
      description: "when a child combinator is used instead of nesting",
      message: messages.expected(" ", "combinator"),
      line: 2,
      column: 11,
      endLine: 2,
      endColumn: 12
    },
    {
      code: `
      .foo.bar {}
      `,
      description: "when a selector is chained with another",
      message: messages.expected("bar", "class"),
      line: 2,
      column: 11,
      endLine: 2,
      endColumn: 15
    },
    {
      code: `
      .foo > .bar {}
      `,
      description:
        "when a direct descendant combinator is used without nesting",
      message: messages.expected(">", "combinator"),
      line: 2,
      column: 11,
      endLine: 2,
      endColumn: 14
    },
    {
      code: `
      .foo:hover {}
      `,
      description: "when pseudo classes are used without nesting",
      message: messages.expected(":hover", "pseudo"),
      line: 2,
      column: 11,
      endLine: 2,
      endColumn: 17
    },
    {
      code: `
      * + li {}
      `,
      description: "when universal selectors are used with a combinator",
      message: messages.expected("+", "combinator"),
      line: 2,
      column: 8,
      endLine: 2,
      endColumn: 11
    },
    {
      code: `
      :nth-child(2n - 1):last-child {}
      `,
      description: "when pseudo selectors only are chained",
      message: messages.expected(":last-child", "pseudo"),
      line: 2,
      column: 25,
      endLine: 2,
      endColumn: 36
    },
    {
      code: `
      .class-name #{if(&, "&", "")} {}
      `,
      description: "when interpolation is used",
      message: messages.expectedInterpolation,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 19
    }
  ]
});

testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .foo .bar {}
      `,
      description: "when a child combinator is used instead of nesting"
    },
    {
      code: `
      .foo.bar {}
      `,
      description: "when a selector is chained with another"
    },
    {
      code: `
      .foo > .bar {}
      `,
      description: "when a direct descendant combinator is used without nesting"
    },
    {
      code: `
      .foo:hover {}
      `,
      description: "when pseudo classes are used without nesting"
    },
    {
      code: `
      @media screen {
        .foo {}
      }
      `,
      description: "when selectors are nested inside @media"
    },
    {
      code: `
      @keyframes foo {
        0% {}
        100% {}
      }
      `,
      description: "when a keyframes rule is used"
    },
    {
      code: `
      @include mixin {
        .foo {}
      }
      `,
      description:
        "when selectors are nested in a mixin, e.g. when making use of @content"
    },
    {
      code: `
      .foo:nth-child(2n-1) {}
      `,
      description: "when using an nth-child selector"
    },
    {
      code: `
      #foo:not([class]:last-child) {}
      `,
      description: "when using a not selector"
    },
    {
      code: `
      .class-name #{if(&, "&", "")} {}
      `,
      description: "should support interpolation"
    },
    {
      code: `
      a {
        font: {
          size: 10px;
          weight: 400;
        }
      }
      `,
      description: "ignores nested properties"
    },
    {
      code: `
      @keyframes foo {
	      0% {
		      color: blue;
        }
        50.5% {
          color: red;
        }
      }
      `,
      description: "ignores @keyframes"
    }
  ],

  reject: [
    {
      code: `
      .foo {
        .bar {}
      }
      `,
      description: "when child combinators are nested",
      message: messages.rejected,
      line: 3,
      column: 9,
      endLine: 3,
      endColumn: 13
    },
    {
      code: `
      .foo {
        &.bar {}
      }
      `,
      description: "when chained combinators are nested",
      message: messages.rejected,
      line: 3,
      column: 9,
      endLine: 3,
      endColumn: 14
    },
    {
      code: `
      .foo {
        & > bar {}
      }
      `,
      description: "when direct descendant combinators are nested",
      message: messages.rejected,
      line: 3,
      column: 9,
      endLine: 3,
      endColumn: 16
    },
    {
      code: `
      .foo {
        &bar {
          &baz {}
        }
      }
      `,
      description: "when parent selectors are used for concatenation",
      warnings: [
        {
          message: messages.rejected,
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 13
        },
        {
          message: messages.rejected,
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 15
        }
      ]
    },
    {
      code: `
      .foo {
        &__bar {
          &--baz {}
        }
      }
      `,
      description: "when parent selectors are used for BEM style concatenation",
      warnings: [
        {
          message: messages.rejected,
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 15
        },
        {
          message: messages.rejected,
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 17
        }
      ]
    },
    {
      code: `
      .foo {
        &:hover {}
      }
      `,
      description: "when pseudo classes are nested",
      message: messages.rejected,
      line: 3,
      column: 9,
      endLine: 3,
      endColumn: 16
    },
    {
      code: `
      .class-name {
	      #{if(&, "&", "")} {

	      }
      }
      `,
      description: "when interpolation is used",
      message: messages.rejected,
      line: 3,
      column: 8,
      endLine: 3,
      endColumn: 25
    }
  ]
});
