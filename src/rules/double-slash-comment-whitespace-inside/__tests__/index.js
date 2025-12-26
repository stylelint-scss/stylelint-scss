import rule from "../index.js";

const { ruleName, messages } = rule;

// -------------------------------------------------------------------------
// "always"
// -------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,
  fix: true,

  accept: [
    {
      code: "// Comment with one space",
      description: "{always} // Comment with one space."
    },
    {
      code: "//    Comment with multiple spaces",
      description: "{always} //    Comment with multiple spaces."
    },
    {
      code: "/// 3-slash comment with space",
      description: "{always} /// 3-slash comment with space."
    },
    {
      code: "/*CSS comment*/",
      description: "{always} /*CSS comment*/ (ignored)"
    },
    {
      code: "///",
      description: "{always} `///`."
    },
    {
      code: "/// ",
      description: "{always} `/// `."
    },
    {
      code: `
      $breadcrumbs-item-separator-item-rtl: '\\\\';
      $button-background: background('');
      `,
      description: "should not throw an error (issue #294)"
    }
  ],

  reject: [
    {
      code: "//Comment with no whitespace",
      fixed: "// Comment with no whitespace",
      message: messages.expected,
      line: 1,
      column: 3
    },
    {
      code: "///3-slash comment with no whitespace",
      fixed: "/// 3-slash comment with no whitespace",
      message: messages.expected,
      line: 1,
      column: 4
    },
    {
      code: `
      //
      // 1. Address appearance set to searchfield in Safari and Chrome.
      // 2. Address box-sizing set to border-box in Safari and Chrome.
      //

      input[type="search"] {
        -webkit-appearance: textfield; // 1
        box-sizing: content-box; //2
      }
    `,
      fixed: `
      //
      // 1. Address appearance set to searchfield in Safari and Chrome.
      // 2. Address box-sizing set to border-box in Safari and Chrome.
      //

      input[type="search"] {
        -webkit-appearance: textfield; // 1
        box-sizing: content-box; // 2
      }
    `,
      message: messages.expected,
      line: 9,
      column: 36
    },
    {
      code: `

      input[type="search"] {

        -webkit-appearance: textfield; // 1
        box-sizing: content-box; //2
      }
    `,
      fixed: `

      input[type="search"] {

        -webkit-appearance: textfield; // 1
        box-sizing: content-box; // 2
      }
    `,
      message: messages.expected,
      line: 6,
      column: 36
    }
  ]
});

testRule({
  ruleName,
  config: ["always"],
  syntax: "html",
  skip: true,

  accept: [
    {
      code: `
//Just text
<style type="text/scss">
// Comment with one space
</style>
//Just text
`
    }
  ],

  reject: [
    {
      code: `
//Just text
<style type="text/scss">
//Comment with no whitespace
</style>
//Just text
`,
      message: messages.expected,
      line: 4,
      column: 3
    }
  ]
});

// -------------------------------------------------------------------------
// "never"
// -------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,
  fix: true,

  accept: [
    {
      code: "//Comment with no whitespace",
      description: "{never} //Comment with no whitespace"
    },
    {
      code: "///3-slash comment with no whitespace",
      description: "{never} ///3-slash comment with no whitespace"
    },
    {
      code: "/*   CSS comment  */",
      description: "{never} /*   CSS comment  */ (ignored)"
    },
    {
      code: "///",
      description: "{never} `///`."
    },
    {
      code: "/// ",
      description: "{never} `/// `."
    }
  ],

  reject: [
    {
      code: "// Comment with one space",
      fixed: "//Comment with one space",
      message: messages.rejected,
      line: 1,
      column: 3
    },
    {
      code: "//    Comment with multiple spaces",
      fixed: "//Comment with multiple spaces",
      message: messages.rejected,
      line: 1,
      column: 3
    },
    {
      code: "\n\n\n\n  /// 3-slash comment with space",
      fixed: "\n\n\n\n  ///3-slash comment with space",
      message: messages.rejected,
      line: 5,
      column: 6
    },
    {
      code: "\r\n\r\n\r\n\r\n  /// 3-slash comment with space",
      fixed: "\r\n\r\n\r\n\r\n  ///3-slash comment with space",
      message: messages.rejected,
      line: 5,
      column: 6
    },
    {
      code: `



      /// 3-slash comment with space
    `,
      fixed: `



      ///3-slash comment with space
    `,
      message: messages.rejected,
      line: 5,
      column: 10
    }
  ]
});

testRule({
  ruleName,
  config: ["never"],
  syntax: "html",
  skip: true,

  accept: [
    {
      code: `
// Just text
<style type="text/scss">
//Comment with one space
</style>
// Just text
`
    }
  ],

  reject: [
    {
      code: `
// Just text
<style type="text/scss">
// Comment with no whitespace
</style>
// Just text
`,
      message: messages.rejected,
      line: 4,
      column: 3
    }
  ]
});
