import ruleTester from "stylelint-rule-tester"
import scss from "postcss-scss"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName, {
  postcssOptions: { syntax: scss },
})

testRule(/foo/, tr => {

  tr.ok(`
    p {
      $foo: 10px;
    }
  `, "Regexp: sequence part. Example: full match.")
  
  tr.ok(`
    p {
      $_foo: 10px;
    }
  `, "Regexp: sequence part. Example: matches at the end.")
  
  tr.ok(`
    p {
      $food: 10px;
    }
  `, "Regexp: sequence part. Example: matches at the beginning.")
  
  tr.notOk(`
    p {
      $floo: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "Regexp: sequence part. Example: symbol in between.")

  tr.notOk(`
    p {
      $ foo: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "Regexp: sequence part. Example: space after $.")

})

testRule("foo", tr => {

  tr.ok(`
    p {
      $foo: 10px;
    }
  `, "String: sequence part. Example: full match.")
  
  tr.ok(`
    p {
      $_foo: 10px;
    }
  `, "String: sequence part. Example: matches at the end.")
  
  tr.ok(`
    p {
      $food: 10px;
    }
  `, "String: sequence part. Example: matches at the beginning.")
  
  tr.notOk(`
    p {
      $floo: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "String: sequence part. Example: symbol in between.")
  
  tr.notOk(`
    p {
      $fo: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "String: sequence part. Example: not a full sequence.")

})

testRule(/^foo$/, tr => {

  tr.ok(`
    p {
      $foo: 10px;
    }
  `, "Regexp: strict pattern. Example: matches.")
  
  tr.notOk(`
    p {
      $_foo: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "Regexp: strict pattern. Example: matches at the end.")
  
  tr.notOk(`
    p {
      $food: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "Regexp: strict pattern. Example: matches at the beginning.")
  
  tr.notOk(`
    p {
      $floo: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "Regexp: strict pattern. Example: symbol in between.")

})

testRule(/^foo/, tr => {

  tr.ok(`
    p {
      $foo: 10px;
    }
  `, "Regexp: pattern at the beginning. Example: matches.")
  
  tr.notOk(`
    p {
      $_foo: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "Regexp: pattern at the beginning. Example: matches at the end.")
  
  tr.ok(`
    p {
      $food: 10px;
    }
  `, "Regexp: pattern at the beginning. Example: matches at the beginning.")
  
  tr.notOk(`
    p {
      $floo: 10px;
    }
  `, {
    line: 3,
    message: messages.expected,
  }, "Regexp: pattern at the beginning. Example: symbol in between.")

})

testRule(/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, function (tr) {
  
  tr.ok("a { $Foo-bar: 0; }", "Regexp: SUIT component. Example: comply")
  
  tr.ok("a { $Foo-barBaz: 0; }", "Regexp: SUIT component. Example: comply")
    
  tr.notOk(
    "a { $boo-Foo-bar: 0; }", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: starts with lowercase, two elements")

  tr.notOk(
    "a { $foo-bar: 0; }", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: starts with lowercase")

  tr.notOk(
    "a { $Foo-Bar: 0; }", {
      line: 1,
      message: messages.expected,
    }, "Regexp: SUIT component. Example: element starts with uppercase")

})