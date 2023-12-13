import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "@charset 'UTF-8';"
    },
    {
      code: "@CHARSET 'UTF-8';"
    },
    {
      code: "@charset 'iso-8859-15'"
    },
    {
      code: '@import url("fineprint.css") print;'
    },
    {
      code: "@import 'custom.css'"
    },
    {
      code: "@import url('landscape.css') screen and (orientation:landscape);"
    },
    {
      code: "@namespace url(http://www.w3.org/1999/xhtml);"
    },
    {
      code: "@namespace prefix url(XML-namespace-URL);"
    },
    {
      code: "@media print { body { font-size: 10pt } }"
    },
    {
      code: "@media (max-width: 960px) { body { font-size: 13px } }"
    },
    {
      code: "@media screen, print { body { line-height: 1.2 } }"
    },
    {
      code: "@supports (--foo: green) { body { color: green; } }"
    },
    {
      code: "@supports ( (perspective: 10px) or (-webkit-perspective: 10px) ) { font-size: 10pt }"
    },
    {
      code: "@counter-style win-list { system: fixed; symbols: url(gold-medal.svg); suffix: ' ';}"
    },
    {
      code: "@document url(http://www.w3.org/), url-prefix(http://www.w3.org/Style/), domain(mozilla.org), regexp('https:.*')"
    },
    {
      code: "@page :left { margin-left: 4cm; }"
    },
    {
      code: '@font-face { font-family: MyHelvetica; src: local("Helvetica"), url(MgOpenModern.ttf); }'
    },
    {
      code: "@keyframes identifier { 0% { top: 0; left: 0; } 30% { top: 50px; } 68%, 100% { top: 100px; left: 100%; } }"
    },
    {
      code: "@-webkit-keyframes identifier { 0% { top: 0; left: 0; } 30% { top: 50px; } 68%, 100% { top: 100px; left: 100%; } }"
    },
    {
      code: "@viewport { min-width: 640px; max-width: 800px; }"
    },
    {
      code: "@viewport { orientation: landscape; }"
    },
    {
      code: '@counter-style winners-list { system: fixed; symbols: url(gold-medal.svg); suffix: " "; }'
    },
    {
      code: "@font-feature-values Font One { @styleset { nice-style: 12; } }"
    },
    {
      code: ".foo { color: red; @nest .parent & { color: blue; } }"
    },
    {
      code: '@forward "functions";'
    },
    {
      code: "@function foo () {}"
    },
    {
      code: "@extend %p"
    },
    {
      code: "@if ($i) {}"
    },
    {
      code: "@if ($i) {} @else {}"
    },
    {
      code: "@if ($i) {} @else if {} @else {}"
    },
    {
      code: '@use "bootstrap";'
    }
  ],

  reject: [
    {
      code: dedent`
        @funciton floo ($n) {}
      `,
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 10,
      description: "",
      message: messages.rejected("@funciton")
    },
    {
      code: `
      @Function foo () { @return 1; }
    `,
      line: 2,
      description: "",
      message: messages.rejected("@Function")
    },
    {
      code: `
      @While ($i == 1) {}
    `,
      line: 2,
      description: "",
      message: messages.rejected("@While")
    }
  ]
});

testRule({
  ruleName,
  config: [
    true,
    {
      ignoreAtRules: ["unknown", "/^my-/i"]
    }
  ],
  skipBasicChecks: true,

  accept: [
    {
      code: "@unknown { }"
    },
    {
      code: "@my-at-rule { }"
    },
    {
      code: "@MY-other-at-rule { }"
    }
  ],

  reject: [
    {
      code: "@unknown-at-rule { }",
      line: 1,
      column: 1,
      message: messages.rejected("@unknown-at-rule")
    },
    {
      code: "@unknown { @unknown-at-rule { font-size: 14px; } }",
      line: 1,
      column: 12,
      message: messages.rejected("@unknown-at-rule")
    },
    {
      code: "@not-my-at-rule {}",
      line: 1,
      column: 1,
      message: messages.rejected("@not-my-at-rule")
    },
    {
      code: "@Unknown { }",
      line: 1,
      column: 1,
      message: messages.rejected("@Unknown")
    },
    {
      code: "@uNkNoWn { }",
      line: 1,
      column: 1,
      message: messages.rejected("@uNkNoWn")
    },
    {
      code: "@UNKNOWN { }",
      line: 1,
      column: 1,
      message: messages.rejected("@UNKNOWN")
    }
  ]
});

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  reject: [
    {
      code: "@foo { } @bar { }",
      description: "Unexpected unknown at-rule",
      warnings: [
        {
          line: 1,
          column: 1,
          message: messages.rejected("@foo")
        },
        {
          line: 1,
          column: 10,
          message: messages.rejected("@bar")
        }
      ]
    }
  ]
});
