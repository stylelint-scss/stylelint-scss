import ruleTester from "stylelint-rule-tester"
import scss from "postcss-scss"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName, {
  postcssOptions: { syntax: scss },
})

testRule(undefined, tr => {

  tr.ok(`
    p {
      &.foo {}
    }
  `, "when an amperand is chained with class")

  tr.ok(`
    p {
      .foo > & {}
    }
  `, "when an amperand follows a direct descendant operator")

  tr.ok(`
    p {
      .foo  >  & {}
    }
  `, "when an amperand follows a direct descendant operator and there are extra spaces")

  tr.ok(`
    p {
      .foo>& {}
    }
  `, "when an amperand follows a direct descendant operator and there are no spaces")

  tr.ok(`
    p {
      & + & {}
      & ~ & {}
    }
  `, "when an ampersand precedes a sibling operator")

  tr.ok(`
    p {
      & + .foo {}
    }
  `, "when an ampersand precedes a sibling operator")

  tr.ok(`
    p {
      & + &:hover {}
    }
  `, "when multiple ampersands exist with one concatenated")

  tr.ok(`
    p {
      &,
      .foo,
      .bar {
        margin: 0;
      }
    }
  `, "when an amperand is used in a comma sequence to DRY up code")

  tr.ok(`
    .icon {
      &-small {}
    }
  `, "when an ampersand is used in concatentation")

  tr.ok(`
    .icon {
      & &-small {}
    }
  `, "when an ampersand is used in concatentation following an ampersand")

  tr.ok(`
    div[id="foo&bar"] {
      &.foo {}
    }
  `, "when an ampersand is used in an attribute selector")

  tr.notOk(`
    p {
      & > a {}
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when an amperand precedes a direct descendant operator")

  tr.notOk(`
    p {
      &  >  a {}
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when an amperand precedes a direct descendant operator and there are extra spaces")

  tr.notOk(`
    p {
      &>a{}
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when an amperand precedes a direct descendant operator and there are no spaces")

  tr.notOk(`
    p {
      & a {}
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when an amperand precedes a general child")

  tr.notOk(`
    p {
      & .class {}
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when an amperand precedes a class")

  tr.notOk(`
    p {
      &  .class {}
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when an amperand precedes a class and there are extra spaces")

  tr.notOk(`
    p {
      & {}
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when an ampersand is used by itself")

})
