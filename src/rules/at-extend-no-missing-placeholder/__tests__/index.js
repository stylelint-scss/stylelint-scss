import ruleTester from "stylelint-rule-tester"
import scss from "postcss-scss"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName, {
  postcssOptions: { syntax: scss },
})

testRule(undefined, tr => {

  tr.ok(`
    p {
      @extend %placeholder;
    }
  `, "when extending with a placeholder")

  tr.ok(`
    p {
      @extend #{$dynamically_generated_placeholder_name};
    }
  `, "when extending with a dynamic selector")

  tr.ok(`
    p {
      @extend %foo-#{$dynamically_generated_placeholder_name};
    }
  `, "when extending with a dynamic selector whose prefix is a placeholder")

  tr.notOk(`
    p {
      @extend span;
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when extending with an element")

  tr.notOk(`
    p {
      @extend #some-identifer;
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when extending with an id")

  tr.notOk(`
    p {
      @extend .some-class;
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when extending with a class")

  tr.notOk(`
    p {
      @extend .blah-#{$dynamically_generated_name};
    }
  `, {
    line: 3,
    message: messages.rejected,
  }, "when extending with a dyncamic selector whose prefix is not a placeholder")

})
