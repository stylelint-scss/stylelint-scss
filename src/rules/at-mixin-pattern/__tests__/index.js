import ruleTester from "stylelint-rule-tester"
import scss from "postcss-scss"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName, {
  postcssOptions: { syntax: scss },
})

testRule(/foo/, tr => {

  tr.ok(`
    @mixin foo {
    }
  `, "Regexp: sequence part. Example: full match.")
  
  tr.ok(`
    @mixin foo ($links: 10){
    }
  `, "Regexp: sequence part. Example: full match, with params.")
  
  tr.ok(`
    @mixin _foo {
    }
  `, "Regexp: sequence part. Example: matches at the end.")
  
  tr.ok(`
    @mixin food {
    }
  `, "Regexp: sequence part. Example: matches at the beginning.")
  
  tr.notOk(`
    @mixin floo {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: sequence part. Example: symbol in between.")

  tr.ok(`
    @mixin  foo {
    }
  `, "Regexp: sequence part. Example: space after @mixin .")

})

testRule("foo", tr => {

  tr.ok(`
    @mixin foo {
    }
  `, "String: sequence part. Example: full match.")
  
  tr.ok(`
    @mixin _foo {
    }
  `, "String: sequence part. Example: matches at the end.")
  
  tr.ok(`
    @mixin food {
    }
  `, "String: sequence part. Example: matches at the beginning.")
  
  tr.notOk(`
    @mixin floo {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "String: sequence part. Example: symbol in between.")
  
  tr.notOk(`
    @mixin fo {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "String: sequence part. Example: not a full sequence.")

})

testRule(/^foo$/, tr => {

  tr.ok(`
    @mixin foo {
    }
  `, "Regexp: strict pattern. Example: matches.")
  
  tr.notOk(`
    @mixin _foo {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: strict pattern. Example: matches at the end.")
  
  tr.notOk(`
    @mixin food {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: strict pattern. Example: matches at the beginning.")
  
  tr.notOk(`
    @mixin floo {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: strict pattern. Example: symbol in between.")

})

testRule(/^foo/, tr => {

  tr.ok(`
    @mixin foo {
    }
  `, "Regexp: pattern at the beginning. Example: matches.")
  
  tr.notOk(`
    @mixin _foo {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: pattern at the beginning. Example: matches at the end.")
  
  tr.ok(`
    @mixin food {
    }
  `, "Regexp: pattern at the beginning. Example: matches at the beginning.")
  
  tr.notOk(`
    @mixin floo {
    }
  `, {
    line: 2,
    message: messages.expected,
  }, "Regexp: pattern at the beginning. Example: symbol in between.")

})

testRule(/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, function (tr) {
  
  tr.ok("@mixin Foo-bar  ( $p: 1 ) {}", "Regexp: SUIT component. Example: comply")
  
  tr.ok("@mixin Foo-barBaz {}", "Regexp: SUIT component. Example: comply")
    
  tr.notOk(
    "@mixin boo-Foo-bar {}", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: starts with lowercase, two elements")

  tr.notOk(
    "@mixin foo-bar {}", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: starts with lowercase")

  tr.notOk(
    "@mixin Foo-Bar {}", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: element starts with uppercase")

})