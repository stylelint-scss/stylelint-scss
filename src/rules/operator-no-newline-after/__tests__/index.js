"use strict";

const { messages, ruleName } = require("..");

// ------------------------------------------------------------------------
// Testing +
// ------------------------------------------------------------------------

// +, before a number (with or without a unit)
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { width: 1 +1; }",
      description: "List. width: 1 +1."
    },
    {
      code: "a { width: s1- +1; }",
      description: "List. width: s1- +1."
    },
    {
      code: `
      a {
        width: 10px
          + 1;
      }
    `,
      description: "Newline before the op: 10px\\n          + 1"
    },
    {
      code: `
      a {
        width: 10px /
          1;
      }
    `,
      description:
        "Newline after a character, that is not an operator: 10px /\\n  1"
    },
    {
      code: `
      a {
        width: 10px + 1
          + 1;
      }
    `,
      description: "Newline after the following op: 10px + 1\\n         + 1"
    },
    {
      code: `
      @font-face {
        font-family: 'Ampersand';
        src: local('Times New Roman');
        unicode-range: U+26;
      }
      `,
      description: "unicode-range"
    }
  ],

  reject: [
    {
      code: `
      a {
        width: 10px +
         1;
      }
    `,
      description: "Newline-operator-indentation: 10px +\\n1px.",
      message: messages.rejected("+"),
      line: 3,
      column: 21,
      endLine: 3,
      endColumn: 22
    },
    {
      code: `
      a {
        width: 10px +
1;
      }
    `,
      description: "Newline-operator-operand: 10px +\\n1px.",
      message: messages.rejected("+"),
      line: 3,
      column: 21
    }
  ]
});

testRule({
  ruleName,
  config: [true],
  syntax: "html",
  skip: true,
  skipBasicChecks: true,

  accept: [
    {
      code: `
a {
  width: 10px +
    1;
}
<style type="text/scss">
a {
  width: 10px
    + 1;
}
</style>
`
    }
  ],

  reject: [
    {
      code: `
a {
  width: 10px +
    1;
}
<style type="text/scss">
 a {
  width: 10px +
    1;
}
</style>
`,
      message: messages.rejected("+"),
      line: 8,
      column: 15
    }
  ]
});
