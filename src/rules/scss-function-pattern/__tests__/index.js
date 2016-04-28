import ruleTester from "stylelint-rule-tester"
import scss from "postcss-scss"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName, {
  postcssOptions: { syntax: scss },
})

testRule(/foo/, tr => {

  tr.ok(`
    @functio1n foo () {
    }
  `, "Regexp: sequence part. Example: full match.")
  
  tr.ok(`
    @function foo ($links: 10){
    }
  `, "Regexp: sequence part. Example: full match, with params.")
  
  tr.ok(`
    @function _foo ($n) {
    }
  `, "Regexp: sequence part. Example: matches at the end.")
  
  tr.ok(`
    @function food ($n) {
    }
  `, "Regexp: sequence part. Example: matches at the beginning.")
  
  tr.notOk(`
    @function floo ($n) {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: sequence part. Example: symbol in between.")

  tr.ok(`
    @function  foo ($n) {
    }
  `, "Regexp: sequence part. Example: space after @function.")

  tr.ok(`
    @functio1n foo ($n) {
    }
  `, "Any pattern. Example: not a SCSS function, skipping.")

  tr.ok(`
    @function
    foo
    ($n) {
    }
  `, "Regexp: sequence part. Example: newlines around a function name.")

})

testRule("foo", tr => {

  tr.ok(`
    @function foo ($p) {
    }
  `, "String: sequence part. Example: full match.")
  
  tr.ok(`
    @function _foo ($p) {
    }
  `, "String: sequence part. Example: matches at the end.")
  
  tr.ok(`
    @function food ($p) {
    }
  `, "String: sequence part. Example: matches at the beginning.")
  
  tr.notOk(`
    @function floo ($p) {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "String: sequence part. Example: symbol in between.")
  
  tr.notOk(`
    @function fo ($p) {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "String: sequence part. Example: not a full sequence.")

})

testRule(/^foo$/, tr => {

  tr.ok(`
    @function foo ($p) {
    }
  `, "Regexp: strict match. Example: matches.")
  
  tr.notOk(`
    @function _foo ($p) {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: strict match. Example: matches at the end.")
  
  tr.notOk(`
    @function food ($p) {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: strict match. Example: matches at the beginning.")
  
  tr.notOk(`
    @function floo ($p) {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: strict match. Example: symbol in between.")

  tr.ok(`
    @function
    foo
    ($p) {
    }
  `, "Regexp: strict match. Example: newlines around a function name.")

  tr.notOk(`
    @function 1
    foo
    ($p) {
    }
  `, {
    line: 2,
    message: messages.expected,
  },  "Regexp: strict match. Example: function name divided by newlines.")

})

testRule(/^foo/, tr => {

  tr.ok(`
    @function foo ($p) {
    }
  `, "Regexp: pattern at the beginning. Example: matches.")
  
  tr.notOk(`
    @function _foo ($p) {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: pattern at the beginning. Example: matches at the end.")
  
  tr.ok(`
    @function food ($p) {
    }
  `, "Regexp: pattern at the beginning. Example: matches at the beginning.")
  
  tr.notOk(`
    @function floo ($p) {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: pattern at the beginning. Example: symbol in between.")

})

testRule(/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, function (tr) {
  
  tr.ok("@function Foo-bar  ( $p: 1 ) {}", "Regexp: SUIT component. Example: comply")
  
  tr.ok("@function Foo-barBaz {}", "Regexp: SUIT component. Example: comply")
    
  tr.notOk(
    "@function boo-Foo-bar ( $p) {}", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: starts with lowercase, two elements")

  tr.notOk(
    "@function foo-bar ($p) {}", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: starts with lowercase")

  tr.notOk(
    "@function Foo-Bar ($p) {}", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: element starts with uppercase")

})