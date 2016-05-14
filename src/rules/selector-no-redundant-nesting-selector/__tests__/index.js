import testRule from "stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",

  accept: [ {
    code: `
      p {
        &.foo {}
      }
    `,
    description: "when an amperand is chained with class",
  }, {
    code: `
      p {
        .foo > & {}
      }
    `,
    description: "when an amperand follows a direct descendant operator",
  }, {
    code: `
      p {
        .foo  >  & {}
      }
    `,
    description: "when an amperand follows a direct descendant operator and there are extra spaces",
  }, {
    code: `
      p {
        .foo>& {}
      }
    `,
    description: "when an amperand follows a direct descendant operator and there are no spaces",
  }, {
    code: `
      p {
        & + & {}
        & ~ & {}
      }
    `,
    description: "when an ampersand precedes a sibling operator",
  }, {
    code: `
      p {
        & + .foo {}
      }
    `,
    description: "when an ampersand precedes a sibling operator",
  }, {
    code: `
      p {
        & + &:hover {}
      }
    `,
    description: "when multiple ampersands exist with one concatenated",
  }, {
    code: `
      p {
        &,
        .foo,
        .bar {
          margin: 0;
        }
      }
    `,
    description: "when an amperand is used in a comma sequence to DRY up code",
  }, {
    code: `
      .icon {
        &-small {}
      }
    `,
    description: "when an ampersand is used in concatentation",
  }, {
    code: `
      .icon {
        & &-small {}
      }
    `,
    description: "when an ampersand is used in concatentation following an ampersand",
  }, {
    code: `
      div[id="foo&bar"] {
        &.foo {}
      }
    `,
    description: "when an ampersand is used in an attribute selector",
  } ],

  reject: [ {
    code: `
      p {
        & > a {}
      }
    `,
    line: 3,
    message: messages.rejected,
    description: "when an amperand precedes a direct descendant operator",
  }, {
    code: `
      p {
        &  >  a {}
      }
    `,
    line: 3,
    message: messages.rejected,
    description: "when an amperand precedes a direct descendant operator and there are extra spaces",
  }, {
    code: `
      p {
        &>a{}
      }
    `,
    line: 3,
    message: messages.rejected,
    description: "when an amperand precedes a direct descendant operator and there are no spaces",
  }, {
    code: `
      p {
        & a {}
      }
    `,
    line: 3,
    message: messages.rejected,
    description: "when an amperand precedes a general child",
  }, {
    code: `
      p {
        & .class {}
      }
    `,
    line: 3,
    message: messages.rejected,
    description: "when an amperand precedes a class",
  }, {
    code: `
      p {
        &  .class {}
      }
    `,
    line: 3,
    message: messages.rejected,
    description: "when an amperand precedes a class and there are extra spaces",
  }, {
    code: `
      p {
        & {}
      }
    `,
    line: 3,
    message: messages.rejected,
    description: "when an ampersand is used by itself",
  } ],
})
