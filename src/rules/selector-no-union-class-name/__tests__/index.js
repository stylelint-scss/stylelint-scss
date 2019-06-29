import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",

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
      description: "when an ampersand is chained with conbinator"
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
