import testRule from "stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [ {
    code: "@charset 'UTF-8';",
  }, {
    code: "@CHARSET 'UTF-8';",
  }, {
    code: "@charset 'iso-8859-15'",
  }, {
    code: "@import url(\"fineprint.css\") print;",
  }, {
    code: "@import 'custom.css'",
  }, {
    code: "@import url('landscape.css') screen and (orientation:landscape);",
  }, {
    code: "@namespace url(http://www.w3.org/1999/xhtml);",
  }, {
    code: "@namespace prefix url(XML-namespace-URL);",
  }, {
    code: "@media print { body { font-size: 10pt } }",
  }, {
    code: "@media (max-width: 960px) { body { font-size: 13px } }",
  }, {
    code: "@media screen, print { body { line-height: 1.2 } }",
  }, {
    code: "@supports (--foo: green) { body { color: green; } }",
  }, {
    code: "@supports ( (perspective: 10px) or (-webkit-perspective: 10px) ) { font-size: 10pt }",
  }, {
    code: "@counter-style win-list { system: fixed; symbols: url(gold-medal.svg); suffix: ' ';}",
  }, {
    code: "@document url(http://www.w3.org/), url-prefix(http://www.w3.org/Style/), domain(mozilla.org), regexp('https:.*')",
  }, {
    code: "@page :left { margin-left: 4cm; }",
  }, {
    code: "@font-face { font-family: MyHelvetica; src: local(\"Helvetica\"), url(MgOpenModern.ttf); }",
  }, {
    code: "@keyframes identifier { 0% { top: 0; left: 0; } 30% { top: 50px; } 68%, 100% { top: 100px; left: 100%; } }",
  }, {
    code: "@-webkit-keyframes identifier { 0% { top: 0; left: 0; } 30% { top: 50px; } 68%, 100% { top: 100px; left: 100%; } }",
  }, {
    code: "@viewport { min-width: 640px; max-width: 800px; }",
  }, {
    code: "@viewport { orientation: landscape; }",
  }, {
    code: "@counter-style winners-list { system: fixed; symbols: url(gold-medal.svg); suffix: \" \"; }",
  }, {
    code: "@font-feature-values Font One { @styleset { nice-style: 12; } }",
  }, {
    code: ".foo { color: red; @nest .parent & { color: blue; } }",
  }, {
    code: "@function foo () {}",
  }, {
    code: "@Function foo () { @return 1; }",
  }, {
    code: "@extend %p",
  }, {
    code: "@While ($i == 1) {}",
  }, {
    code: "@if ($i) {}",
  }, {
    code: "@if ($i) {} @else {}",
  } ],

  reject: [{
    code: `
      @funciton floo ($n) {}
    `,
    line: 2,
    description: "",
    message: messages.rejected("@funciton"),
  }],
})

testRule(rule, {
  ruleName,
  config:  [ true, {
    ignoreAtRules: [ "unknown", "/^my-/" ],
  } ],
  skipBasicChecks: true,

  accept: [ {
    code: "@unknown { }",
  }, {
    code: "@Unknown { }",
  }, {
    code: "@uNkNoWn { }",
  }, {
    code: "@UNKNOWN { }",
  }, {
    code: "@my-at-rule { }",
  }, {
    code: "@MY-other-at-rule { }",
  } ],

  reject: [ {
    code: "@unknown-at-rule { }",
    line: 1,
    column: 1,
    message: messages.rejected("@unknown-at-rule"),
  }, {
    code: "@unknown { @unknown-at-rule { font-size: 14px; } }",
    line: 1,
    column: 12,
  }, {
    code: "@not-my-at-rule {}",
    line: 1,
    column: 1,
    message: messages.rejected("@not-my-at-rule"),
  } ],
})
