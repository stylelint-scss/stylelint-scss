"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: "a { $var1 :200px }",
      description: "a { $var1 :200px }"
    },
    {
      code: "a { $var1 : 200px }",
      description: "a { $var1 : 200px }"
    },
    {
      code: "a { $var1 :\n200px }",
      description: "a { $var1 :\\n200px }"
    },
    {
      code: "a { $var1 :\r\n200px }",
      description: "a { $var1 :\\r\\n200px }"
    },
    {
      code: "a { width: 10px; }",
      description: "Not a SCSS var, ignoring: width: 10px."
    },
    {
      code: "$background : url(data:application/font-woff;...);",
      description: "$background : url(data:application/font-woff;...);"
    },
    {
      code: "@function ($a:10) {}",
      description:
        "Default in a function definition, ignored: @function ($a: 10)"
    }
  ],

  reject: [
    {
      code: "a { $var1: 200px; }",
      fixed: "a { $var1 : 200px; }",
      description: "a { $var1: 200px; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var1  : 200px; }",
      fixed: "a { $var1 : 200px; }",
      description: "a { $var1  : 200px; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 12
    },
    {
      code: "a { $var1\t: 200px; }",
      fixed: "a { $var1 : 200px; }",
      description: "Tab before: a { $var1\\t: 200px; }",
      message: messages.expectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { $var1\n: 200px; }",
      fixed: "a { $var1 : 200px; }",
      description: "Newline before: a { $var1\\n: 200px; }",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { $var1\r\n: 200px; }",
      fixed: "a { $var1 : 200px; }",
      description: "CRLF before: a { $var1\\r\\n: 200px; }",
      message: messages.expectedBefore(),
      line: 2,
      column: 1
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: "a { $var1:200px }",
      description: "a { $var1:200px }"
    },
    {
      code: "a { $var1: 200px }",
      description: "a { $var1: 200px }"
    },
    {
      code: "a { $var1:\n200px }",
      description: "a { $var1:\\n200px }"
    },
    {
      code: "a { $var1:\r\n200px }",
      description: "a { $var1:\\r\\n200px }"
    },
    {
      code: "a { width : 10px; }",
      description: "Not a SCSS var, ignoring: width : 10px;"
    }
  ],

  reject: [
    {
      code: "a { $var1 : 200px; }",
      fixed: "a { $var1: 200px; }",
      description: "a { $var1 : 200px; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { $var1  : 200px; }",
      fixed: "a { $var1: 200px; }",
      description: "a { $var1  : 200px; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 12
    },
    {
      code: "a { $var1\t: 200px; }",
      fixed: "a { $var1: 200px; }",
      description: "a { $var1\\t: 200px; }",
      message: messages.rejectedBefore(),
      line: 1,
      column: 11
    },
    {
      code: "a { $var1\n: 200px; }",
      fixed: "a { $var1: 200px; }",
      description: "a { $var1\\n: 200px; }",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    },
    {
      code: "a { $var1\r\n: 200px; }",
      fixed: "a { $var1: 200px; }",
      description: "a { $var1\\r\\n: 200px; }",
      message: messages.rejectedBefore(),
      line: 2,
      column: 1
    }
  ]
});
