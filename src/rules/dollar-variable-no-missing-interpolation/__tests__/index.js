"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",

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
