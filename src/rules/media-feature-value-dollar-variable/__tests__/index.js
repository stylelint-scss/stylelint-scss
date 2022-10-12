import { ruleName, messages } from "..";

// Required ("always")
testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @media print {
        .navbar { display: none; }
      }
    `,
      description: "Always. Example: no value.",
    },
    {
      code: `
      @media screen and (max-width: $val) {
        a { display: none; }
      }
    `,
      description: "Always. Example: value is a var.",
    },
    {
      code: `
      @media screen and (max-width: #{$val}) {
        a { display: none; }
      }
    `,
      description: "Always. Example: value is interpolation of a single var.",
    },
    {
      code: `
      @media screen and (max-width: #{$val} ) {
        a { display: none; }
      }
    `,
      description:
        "Always. Example: value is interpolation of a single var; space after the interpolation.",
    },
    {
      code: `
      @media screen and (max-width: #{ $val } ) {
        a { display: none; }
      }
    `,
      description:
        "Always. Example: value is interpolation of a single var spaces inside the interpolation.",
    },
    {
      code: `
      @media screen and (max-width:  #{$val} ) {
        a { display: none; }
      }
    `,
      description:
        "Always. Example: value is interpolation of a single var; spaces before and after the interpolation.",
    },
  ],

  reject: [
    {
      code: `
      @media (max-width: 100px) {
        b { color: red; }
      }
    `,
      line: 2,
      column: 26,
      message: messages.expected,
      description: "Always. Example: value is not a var, space before.",
    },
    {
      code: `
      @media (max-width:100px) {
        b { color: red; }
      }
    `,
      line: 2,
      column: 25,
      message: messages.expected,
      description: "Always. Example: value is not a var, no spaces.",
    },
    {
      code: `
      @media screen and
      (max-width: 100px) {
        b { color: red; }
      }
    `,
      line: 3,
      column: 19,
      message: messages.expected,
      description:
        "Always. Example: value is not a var, newline before statement.",
    },
    {
      code: `
      @media screen and (max-width:
        100px) {
        b { color: red; }
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Always. Example: value is not a var, newline before value.",
    },
    {
      code: `
      @media screen and (max-width: 100px
      ) {
        b { color: red; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.expected,
      description: "Always. Example: value is not a var, newline after value.",
    },
    {
      code: `
      @media screen and
      (max-width: $var), or
      (min-width: 100px){
        b { color: red; }
      }
    `,
      line: 4,
      column: 19,
      message: messages.expected,
      description: "Always. Example: multiple statements, one has non-var.",
    },
    {
      code: `
      @media screen and (max-width: #{$val} + 10px) {
        a { display: none; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.expected,
      description:
        "Always. Example: value is a math op on an interpolation of a single var and a regular value.",
    },
    {
      code: `
      @media screen and (max-width: #{$val + 10px} ) {
        a { display: none; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.expected,
      description:
        "Always. Example: value is an interpolation of a math op on a var and a regular value.",
    },
    {
      code: `
      @media screen and (max-width: #{$val + $x} ) {
        a { display: none; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.expected,
      description:
        "Always. Example: value is an interpolation of a math op on a var and a var.",
    },
    {
      code: `
      @media screen and (min-width: 100px + 10px){
        b { color: red; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.expected,
      description: "Always. Example: math operation without a var as a value.",
    },
    {
      code: `
      @media screen and (min-width: 100px + $var){
        b { color: red; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.expected,
      description: "Always. Example: math operation with a var as a value.",
    },
    {
      code: `
      @media screen and (min-width: $var + 100px){
        b { color: red; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.expected,
      description: "Always. Example: math operation with a var as a value.",
    },
    {
      code: `
      @media screen and (min-width: funcName($p)){
        b { color: red; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.expected,
      description: "Always. Example: function call as a value.",
    },
    {
      code: `
      @media screen and (pointer: fine){
        b { color: red; }
      }
    `,
      line: 2,
      column: 35,
      message: messages.expected,
      description: "Always. Example: keyword as a value.",
    },
  ],
});

// Not allowed ("never")
testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @media print {
        .navbar { display: none; }
      }
    `,
      description: "Never. Example: no value.",
    },
    {
      code: `
      @media screen and (min-width: 100px + 10px){
        b { color: red; }
      }
    `,
      description: "Never. Example: math operation without a var as a value.",
    },
    {
      code: `
      @media screen and (max-width:
        100px) {
        b { color: red; }
      }
    `,
      description: "Never. Example: value is not a var, newline before value.",
    },
  ],

  reject: [
    {
      code: `
      @media screen and (max-width: $val) {
        a { display: none; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.rejected,
      description: "Never. Example: value is a var.",
    },
    {
      code: `
      @media screen and
      (max-width: $var), or
      (min-width: 100px){
        b { color: red; }
      }
    `,
      line: 3,
      column: 19,
      message: messages.rejected,
      description: "Never. Example: multiple statements, one has non-var.",
    },
    {
      code: `
      @media screen and (min-width: funcName($p)){
        b { color: red; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.rejected,
      description:
        "Never. Example: function call and with a var as a parameter.",
    },
    {
      code: `
      @media screen and (min-width: 100px + $var){
        b { color: red; }
      }
    `,
      message: messages.rejected,
      description:
        "Never. Example: math operation with a var (not the 1st operand) as a value.",
    },
    {
      code: `
      @media screen and (max-width: #{$val + 10px} ) {
        a { display: none; }
      }
    `,
      line: 2,
      column: 37,
      message: messages.rejected,
      description:
        "Never. Example: value is an interpolation of a math op on a var and a regular value.",
    },
  ],
});

// Required ("always"), ignore keywords
testRule({
  ruleName,
  config: ["always", { ignore: "keywords" }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @media screen and (pointer: fine) {
        a { display: none; }
      }
    `,
      description: "Always. Example: value is a keyword.",
    },
    {
      code: `
      @media screen and (max-width: $val) and (prefers-color-scheme: no-preference) {
        a { display: none; }
      }
    `,
      description: "Always. Example: values contain var and keyword with dash.",
    },
    {
      code: `
      @media screen and (color-gamut: rec2020) {
        a { display: none; }
      }
    `,
      description: "Always. Example: value is a keyword with number.",
    },
  ],
});

// Invalid option (false)
testRule({
  ruleName,
  config: [false],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @media screen and (max-width: $val) and (min-width: 200px) {
        a { display: none; }
      }
    `,
      description: "Invalid option. Example: values are mixed.",
    },
  ],
});
