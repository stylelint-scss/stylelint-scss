import testRule from "stylelint-test-rule-tape";
import rule, { ruleName, messages } from "..";

// -------------------------------------------------------------------------
// "always"
// -------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  skipBasicChecks: true,

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
    }
  ],

  reject: [
    {
      code: "//Comment with no whitespace",
      description: "{always} //Comment with no whitespace",
      message: messages.expected,
      line: 1,
      column: 3
    },
    {
      code: "///3-slash comment with no whitespace",
      description: "{always} ///3-slash comment with no whitespace",
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
      description: "\r\n\r\n\r\n\r\n  /// 3-slash comment with space.",
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
      description: "\r\n\r\n\r\n\r\n  /// 3-slash comment with space.",
      message: messages.expected,
      line: 6,
      column: 36
    }
  ]
});

// -------------------------------------------------------------------------
// "never"
// -------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  skipBasicChecks: true,

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
      description: "{never} // Comment with one space.",
      message: messages.rejected,
      line: 1,
      column: 3
    },
    {
      code: "//    Comment with multiple spaces",
      description: "{never} //    Comment with multiple spaces.",
      message: messages.rejected,
      line: 1,
      column: 3
    },
    {
      code: "\n\n\n\n  /// 3-slash comment with space",
      description: "\n\n\n\n  /// 3-slash comment with space.",
      message: messages.rejected,
      line: 5,
      column: 6
    },
    {
      code: "\r\n\r\n\r\n\r\n  /// 3-slash comment with space",
      description: "\r\n\r\n\r\n\r\n  /// 3-slash comment with space.",
      message: messages.rejected,
      line: 5,
      column: 6
    },
    {
      /* eslint-disable no-multiple-empty-lines */
      code: `
    
    
    
      /// 3-slash comment with space
    `,
      /* eslint-disable no-multiple-empty-lines */
      description: "\r\n\r\n\r\n\r\n  /// 3-slash comment with space.",
      message: messages.rejected,
      line: 5,
      column: 10
    }
  ]
});
