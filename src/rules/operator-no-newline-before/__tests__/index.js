import rule from "../index.js";

const { ruleName, messages } = rule;

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
        width: 10px +
          1;
      }
    `,
      description: "Newline after the op: 10px +\\n          1"
    },
    {
      code: `
      a {
        width: 10px
          -1;
      }
    `,
      description:
        "Newline before a character, that is not an operator: 10px\\n-1"
    },
    {
      code: `
      a {
        width: 10px +
          1 + 1;
      }
    `,
      description: "Newline before the preceding op: 10px +\\n          1"
    },
    {
      code: `
        :root {
          --foo: '{{}}';
        }
      `,
      description: "Custom property"
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
        width: 10px
        + 1;
      }
    `,
      description: "Newline-indentation-operator: 10px\\n        + 1.",
      message: messages.rejected("+"),
      line: 4,
      column: 9,
      endLine: 4,
      endColumn: 10
    },
    {
      code: `
      a {
        width: 10px
+ 1;
      }
    `,
      description: "Newline-operator: 10px\\n+ 1.",
      message: messages.rejected("+"),
      line: 4,
      column: 1
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
  width: 10px
    + 1;
}
<style type="text/scss">
a {
  width: 10px +
    1;
}
</style>
`
    }
  ],

  reject: [
    {
      code: `
a {
  width: 10px
    + 1;
}
<style type="text/scss">
 a {
  width: 10px
    + 1;
}
</style>
`,
      message: messages.rejected("+"),
      line: 9,
      column: 5
    }
  ]
});
