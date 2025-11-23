"use strict";

const { ruleName, messages } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      $var: "my-anim";

      .class {
        animation-name: #{$var};
      }
    `,
      description:
        "when variable is a string and it is interpolated in animation-name property"
    },
    {
      code: `
      $var: "my-anim";

      @keyframes #{$var} {}
    `,
      description:
        "when variable is a string and it is interpolated in @keyframes"
    },
    {
      code: `
      $var: my-anim;

      .class {
        animation-name: $var;
      }
    `,
      description:
        "when variable is not a string and it is used in animation-name property"
    },
    {
      code: `
      $var: my-anim;

      .class {
        animation-name: #{$var};
      }
    `,
      description:
        "when variable is not a string and it is interpolated in animation-name property"
    },
    {
      code: `
      $var: my-counter;

      body {
        counter-reset: $var;
      }
    `,
      description:
        "when variable is not a string and it is interpolated in counter-reset property"
    },
    {
      code: `
      $var: my-anim;

      @keyframes #{$var} {}
    `,
      description:
        "when variable is not a string and it is interpolated in @keyframes"
    },
    {
      code: `
      $var: circled-digits;

      @counter-style #{$var} {
        system: fixed;
        symbols: ➀ ➁ ➂;
        suffix: ' ';
        speak-as: numbers;
      }
    `,
      description:
        "when variable is a not string and it is interpolated in @counter-style"
    },
    {
      code: `
      $var: my-anim;

      @supports (animation-name: #{$var}) {
        @keyframes {}
      }
    `,
      description:
        "when variable is not a string and it is interpolated in @supports"
    },
    {
      code: `
      $var: "my-anim";

      @supports (animation-name: #{$var}) {
        @keyframes {}
      }
    `,
      description:
        "when variable is a string and it is interpolated in @supports"
    },
    {
      code: `
      $var: my-anim;

      @supports (animation-name: $var) {
        @keyframes {}
      }
    `,
      description: "when variable is not a string and it is used in @supports"
    },
    {
      code: `
      $var: "my-var";
      $foo: "$var";

      div {
        $bar: "$var";
      }
    `,
      description:
        "when variable is a string and the same name is used inside another string"
    },
    {
      code: `
      $var: "my-var";
      div {
        content: $var;
      }
    `,
      description:
        "when variable is a string and it is used with content property"
    },
    {
      code: `
      $my-var-foo: "my-var";
      div {
        content: $my-var-foo;
      }
    `,
      description:
        "when variable name has dashes and it is used with content property"
    },
    {
      code: `
      @mixin test() {
        $var: "my-anim";

        @keyframes #{$var} {}
      }
    `,
      description:
        "when variable is a string and it is interpolated in @keyframes inside a mixin"
    },
    {
      code: `
      $var-with-dash: "my-anim";

      @keyframes #{$var-with-dash} {}
    `,
      description: "when variable with hyphen is properly interpolated"
    },
    {
      code: `
      $var_with_underscore: "my-anim";

      @keyframes #{$var_with_underscore} {}
    `,
      description: "when variable with underscore is properly interpolated"
    }
  ],

  reject: [
    {
      code: `
      .class {
        $var: "my-anim";
        animation-name: $var;
      }
    `,
      line: 4,
      column: 25,
      endLine: 4,
      endColumn: 29,
      message: messages.rejected("animation-name", "$var"),
      description:
        "when variable is a string and it is not interpolated in animation-name property"
    },
    {
      code: `
      $var: "my-anim";

      .class {
        animation-name: $var;
      }
    `,
      line: 5,
      message: messages.rejected("animation-name", "$var"),
      description:
        "when variable is a string and it is not interpolated in animation-name property"
    },
    {
      code: `
      $var: "my-counter";

      body {
        counter-reset: $var;
      }
    `,
      line: 5,
      message: messages.rejected("counter-reset", "$var"),
      description:
        "when variable is a string and it is not interpolated in counter-reset"
    },
    {
      code: `
      $var: my-anim;

      @keyframes $var {}
    `,
      line: 4,
      column: 18,
      endLine: 4,
      endColumn: 22,
      message: messages.rejected("@keyframes", "$var"),
      description: "when variable is not a string and it is used in @keyframes"
    },
    {
      code: `
      $var: "my-anim";

      @keyframes $var {}
    `,
      line: 4,
      message: messages.rejected("@keyframes", "$var"),
      description:
        "when variable is a string and it is not interpolated in @keyframes"
    },
    {
      code: `
      $var: 'my-anim';

      @keyframes $var {}
    `,
      line: 4,
      message: messages.rejected("@keyframes", "$var"),
      description:
        "when variable is a string and it is not interpolated in @keyframes"
    },
    {
      code: `
      $var: "circled-digits";

      @counter-style $var {
        system: fixed;
        symbols: ➀ ➁ ➂;
        suffix: ' ';
        speak-as: numbers;
      }
    `,
      line: 4,
      column: 22,
      endLine: 4,
      endColumn: 26,
      message: messages.rejected("@counter-style", "$var"),
      description: "when variable is a string and it is used in @counter-style"
    },
    {
      code: `
      $var: circled-digits;

      @counter-style $var {
        system: fixed;
        symbols: ➀ ➁ ➂;
        suffix: ' ';
        speak-as: numbers;
      }
    `,
      line: 4,
      message: messages.rejected("@counter-style", "$var"),
      description:
        "when variable is not a string and it is used in @counter-style"
    },
    {
      code: `
      $var: "my-anim";

      @supports (animation-name: $var) {
        @keyframes {}
      }
    `,
      line: 4,
      column: 34,
      endLine: 4,
      endColumn: 38,
      message: messages.rejected("@supports", "$var"),
      description: "when variable is a string and it is used in @supports"
    },
    {
      code: `
      $var: "my-anim";

      @supports ( animation-name : $var ) {
        @keyframes {}
      }
    `,
      line: 4,
      message: messages.rejected("@supports", "$var"),
      description:
        "when variable is a string and it is used in @supports and there is whitespace"
    },
    {
      code: `
      @mixin test() {
        $var: "my-anim";

        @keyframes $var {}
      }
    `,
      line: 5,
      message: messages.rejected("@keyframes", "$var"),
      description:
        "when variable is a string and it is not interpolated in @keyframes inside a mixin"
    }
  ]
});

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      $var: "my-anim";

      .class {
        animation-name: #{$var};
      }
    `,
      description: "when variable is already interpolated (no fix needed)"
    },
    {
      code: `
      $var: my-anim;

      @keyframes #{$var} {}
    `,
      description:
        "when at-rule variable is already interpolated (no fix needed)"
    }
  ],

  reject: [
    {
      code: `
      .class {
        $var: "my-anim";
        animation-name: $var;
      }
    `,
      fixed: `
      .class {
        $var: "my-anim";
        animation-name: #{$var};
      }
    `,
      message: messages.rejected("animation-name", "$var"),
      description: "should fix string variable in animation-name property"
    },
    {
      code: `
      $var: "my-anim";

      .class {
        animation-name: $var;
      }
    `,
      fixed: `
      $var: "my-anim";

      .class {
        animation-name: #{$var};
      }
    `,
      message: messages.rejected("animation-name", "$var"),
      description: "should fix string variable in animation-name property"
    },
    {
      code: `
      $var: "my-counter";

      body {
        counter-reset: $var;
      }
    `,
      fixed: `
      $var: "my-counter";

      body {
        counter-reset: #{$var};
      }
    `,
      message: messages.rejected("counter-reset", "$var"),
      description: "should fix string variable in counter-reset"
    },
    {
      code: `
      $var: my-anim;

      @keyframes $var {}
    `,
      fixed: `
      $var: my-anim;

      @keyframes #{$var} {}
    `,
      message: messages.rejected("@keyframes", "$var"),
      description: "should fix variable in @keyframes"
    },
    {
      code: `
      $var: "my-anim";

      @keyframes $var {}
    `,
      fixed: `
      $var: "my-anim";

      @keyframes #{$var} {}
    `,
      message: messages.rejected("@keyframes", "$var"),
      description: "should fix string variable in @keyframes"
    },
    {
      code: `
      $var: "circled-digits";

      @counter-style $var {
        system: fixed;
        symbols: ➀ ➁ ➂;
        suffix: ' ';
        speak-as: numbers;
      }
    `,
      fixed: `
      $var: "circled-digits";

      @counter-style #{$var} {
        system: fixed;
        symbols: ➀ ➁ ➂;
        suffix: ' ';
        speak-as: numbers;
      }
    `,
      message: messages.rejected("@counter-style", "$var"),
      description: "should fix string variable in @counter-style"
    },
    {
      code: `
      $var: circled-digits;

      @counter-style $var {
        system: fixed;
        symbols: ➀ ➁ ➂;
        suffix: ' ';
        speak-as: numbers;
      }
    `,
      fixed: `
      $var: circled-digits;

      @counter-style #{$var} {
        system: fixed;
        symbols: ➀ ➁ ➂;
        suffix: ' ';
        speak-as: numbers;
      }
    `,
      message: messages.rejected("@counter-style", "$var"),
      description: "should fix non-string variable in @counter-style"
    },
    {
      code: `
      $var: "my-anim";

      @supports (animation-name: $var) {
        @keyframes {}
      }
    `,
      fixed: `
      $var: "my-anim";

      @supports (animation-name: #{$var}) {
        @keyframes {}
      }
    `,
      message: messages.rejected("@supports", "$var"),
      description: "should fix string variable in @supports"
    },
    {
      code: `
      $var: "my-anim";

      @supports ( animation-name : $var ) {
        @keyframes {}
      }
    `,
      fixed: `
      $var: "my-anim";

      @supports ( animation-name : #{$var} ) {
        @keyframes {}
      }
    `,
      message: messages.rejected("@supports", "$var"),
      description: "should fix string variable in @supports with whitespace"
    },
    {
      code: `
      @mixin test() {
        $var: "my-anim";

        @keyframes $var {}
      }
    `,
      fixed: `
      @mixin test() {
        $var: "my-anim";

        @keyframes #{$var} {}
      }
    `,
      message: messages.rejected("@keyframes", "$var"),
      description: "should fix string variable in @keyframes inside a mixin"
    },
    {
      code: `
      $var1: "anim1";
      $var2: "anim2";

      .class {
        animation: $var1 5s, $var2 3s;
      }
    `,
      fixed: `
      $var1: "anim1";
      $var2: "anim2";

      .class {
        animation: #{$var1} 5s, #{$var2} 3s;
      }
    `,
      message: messages.rejected("animation", "$var1"),
      description: "should fix multiple variables in animation property"
    },
    {
      code: `
      $var-with-dash: "my-anim";

      @keyframes $var-with-dash {}
    `,
      fixed: `
      $var-with-dash: "my-anim";

      @keyframes #{$var-with-dash} {}
    `,
      message: messages.rejected("@keyframes", "$var-with-dash"),
      description: "should fix variable with hyphen in @keyframes"
    },
    {
      code: `
      $var_with_underscore: "my-anim";

      @keyframes $var_with_underscore {}
    `,
      fixed: `
      $var_with_underscore: "my-anim";

      @keyframes #{$var_with_underscore} {}
    `,
      message: messages.rejected("@keyframes", "$var_with_underscore"),
      description: "should fix variable with underscore in @keyframes"
    }
  ]
});
