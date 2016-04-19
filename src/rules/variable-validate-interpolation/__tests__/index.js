import ruleTester from "stylelint-rule-tester"
import scss from "postcss-scss"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName, {
  postcssOptions: { syntax: scss },
})

testRule(undefined, tr => {

  tr.ok(`
    $var: "my-anim";

    .class {
      animation-name: #{$var};
    }
  `, "when variable is a string and it is interpolated in animation-name property")

  tr.ok(`
    $var: "my-anim";

    @keyframes #{$var} {}
  `, "when variable is a string and it is interpolated in @keyframes")

  tr.ok(`
    $var: my-anim;

    .class {
      animation-name: $var;
    }
  `, "when variable is not a string and it is used in animation-name property")

  tr.ok(`
    $var: my-anim;

    .class {
      animation-name: #{$var};
    }
  `, "when variable is not a string and it is interpolated in animation-name property")

  tr.ok(`
    $var: my-counter;

    body {
      counter-reset: $var;
    }
  `, "when variable is not a string and it is interpolated in counter-reset property")

  tr.ok(`
    $var: my-anim;

    @keyframes #{$var} {}
  `, "when variable is not a string and it is interpolated in @keyframes")

  tr.ok(`
    $var: circled-digits;

    @counter-style #{$var} {
      system: fixed;
      symbols: ➀ ➁ ➂;
      suffix: ' ';
      speak-as: numbers;
    }
  `, "when variable is a not string and it is interpolated in @counter-style")

  tr.ok(`
    $var: my-anim;

    @supports (animation-name: #{$var}) {
      @keyframes {}
    }
  `, "when variable is not a string and it is interpolated in @supports")

  tr.ok(`
    $var: "my-anim";

    @supports (animation-name: #{$var}) {
      @keyframes {}
    }
  `, "when variable is a string and it is interpolated in @supports")

  tr.ok(`
    $var: my-anim;

    @supports (animation-name: $var) {
      @keyframes {}
    }
  `, "when variable is not a string and it is used in @supports")

  tr.ok(`
    $var: "my-var";
    $foo: "$var";

    div {
      $bar: "$var";
    }
  `, "when variable is a string and the same name is used inside another string")

  tr.ok(`
    $var: "my-var";
    div {
      content: $var;
    }
  `, "when variable is a string and it is used with content property")

  tr.ok(`
    $my-var-foo: "my-var";
    div {
      content: $my-var-foo;
    }
  `, "when variable name has dashes and it is used with content property")

  tr.ok(`
    @mixin test() {
      $var: "my-anim";

      @keyframes #{$var} {}
    }
  `, "when variable is a string and it is interpolated in @keyframes inside a mixin")

  tr.notOk(`
    .class {
      $var: "my-anim";
      animation-name: $var;
    }
  `, {
    line: 4,
    message: messages.rejected("animation-name", "$var"),
  }, "when variable is a string and it is not interpolated in animation-name property")

  tr.notOk(`
    $var: "my-anim";

    .class {
      animation-name: $var;
    }
  `, {
    line: 5,
    message: messages.rejected("animation-name", "$var"),
  }, "when variable is a string and it is not interpolated in animation-name property")

  tr.notOk(`
    $var: "my-counter";

    body {
      counter-reset: $var;
    }
  `, {
    line: 5,
    message: messages.rejected("counter-reset", "$var"),
  }, "when variable is a string and it is not interpolated in counter-reset")

  tr.notOk(`
    $var: my-anim;

    @keyframes $var {}
  `, {
    line: 4,
    message: messages.rejected("@keyframes", "$var"),
  }, "when variable is not a string and it is used in @keyframes")

  tr.notOk(`
    $var: "my-anim";

    @keyframes $var {}
  `, {
    line: 4,
    message: messages.rejected("@keyframes", "$var"),
  }, "when variable is a string and it is not interpolated in @keyframes")

  tr.notOk(`
    $var: 'my-anim';

    @keyframes $var {}
  `, {
    line: 4,
    message: messages.rejected("@keyframes", "$var"),
  }, "when variable is a string and it is not interpolated in @keyframes")

  tr.notOk(`
    $var: "circled-digits";

    @counter-style $var {
      system: fixed;
      symbols: ➀ ➁ ➂;
      suffix: ' ';
      speak-as: numbers;
    }
  `, {
    line: 4,
    message: messages.rejected("@counter-style", "$var"),
  }, "when variable is a string and it is used in @counter-style")

  tr.notOk(`
    $var: circled-digits;

    @counter-style $var {
      system: fixed;
      symbols: ➀ ➁ ➂;
      suffix: ' ';
      speak-as: numbers;
    }
  `, {
    line: 4,
    message: messages.rejected("@counter-style", "$var"),
  }, "when variable is not a string and it is used in @counter-style")

  tr.notOk(`
    $var: "my-anim";

    @supports (animation-name: $var) {
      @keyframes {}
    }
  `, {
    line: 4,
    message: messages.rejected("@supports", "$var"),
  }, "when variable is a string and it is used in @supports")

  tr.notOk(`
    $var: "my-anim";

    @supports ( animation-name : $var ) {
      @keyframes {}
    }
  `, {
    line: 4,
    message: messages.rejected("@supports", "$var"),
  }, "when variable is a string and it is used in @supports and there is whitespace")

  tr.notOk(`
    @mixin test() {
      $var: "my-anim";

      @keyframes $var {}
    }
  `, {
    line: 5,
    message: messages.rejected("@keyframes", "$var"),
  }, "when variable is a string and it is not interpolated in @keyframes inside a mixin")

})
