import testRule from "stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

// -------------------------------------------------------------------------
// "always"
// -------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [ {
    code: "// Comment with one space",
    description: "// Comment with one space.",
  }, {
    code: "//    Comment with multiple spaces",
    description: "//    Comment with multiple spaces.",
  }, {
    code: "/// 3-slash comment with space",
    description: "/// 3-slash comment with space.",
  }, {
    code: "/*CSS comment*/",
    description: "/*CSS comment*/ (ignored)",
  } ],

  reject: [ {
    code: "//Comment with no whitespace",
    description: "//Comment with no whitespace",
    message: messages.expected,
    line: 1,
    column: 1,
  }, {
    code: "///3-slash comment with no whitespace",
    description: "///3-slash comment with no whitespace",
    message: messages.expected,
    line: 1,
    column: 1,
  } ],
})

// -------------------------------------------------------------------------
// "never"
// -------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [ {
    code: "//Comment with no whitespace",
    description: "//Comment with no whitespace",
  }, {
    code: "///3-slash comment with no whitespace",
    description: "///3-slash comment with no whitespace",
  }, {
    code: "/*   CSS comment  */",
    description: "/*   CSS comment  */ (ignored)",
  } ],

  reject: [ {
    code: "// Comment with one space",
    description: "// Comment with one space.",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "//    Comment with multiple spaces",
    description: "//    Comment with multiple spaces.",
    message: messages.rejected,
    line: 1,
    column: 1,
  }, {
    code: "/// 3-slash comment with space",
    description: "/// 3-slash comment with space.",
    message: messages.rejected,
    line: 1,
    column: 1,
  } ],
})
