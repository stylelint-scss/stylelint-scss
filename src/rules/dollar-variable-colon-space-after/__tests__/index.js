"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: "a { width:10px }",
      description: "Not an SCSS var, ignored: a { width:10px }"
    },
    {
      code: "a { $var: 10px }",
      description: "a { $var: 10px }"
    },
    {
      code: "a { $var : 10px }",
      description: "a { $var : 10px }"
    },
    {
      code: "a { $var\n: 10px }",
      description: "a { $var\n: 10px }"
    },
    {
      code: "a { $var\r\n: 10px }",
      description: "a { $var\r\n: 10px }"
    },
    {
      code: "$var: 10px;",
      description: "$var: 10px;"
    },
    {
      code: "$var : 10px",
      description: "$var : 10px"
    },
    {
      code: "$var: url(data:application/font-woff;...);",
      description: "Data URI: $var: url(data:application/font-woff;...);"
    },
    {
      code: "@function ($a:10) {}",
      description:
        "Default in a function definition, ignored: @function ($a: 10)"
    }
  ],

  reject: [
    {
      code: "a { $var :10px; }",
      fixed: "a { $var : 10px; }",
      description: "a { $var :10px; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :  10px; }",
      fixed: "a { $var : 10px; }",
      description: "a { $var :  10px; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :\t10px; }",
      fixed: "a { $var : 10px; }",
      description: "Tab after: a { $var :\t10px; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :\n10px; }",
      fixed: "a { $var : 10px; }",
      description: "Newline after: a { $var :\n10px; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :\r\n10px; }",
      fixed: "a { $var : 10px; }",
      description: "Windows newline after: a { $var :\r\n10px; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var:10px; }",
      fixed: "a { $var: 10px; }",
      description: "a { $var:10px; }",
      message: messages.expectedAfter(),
      line: 1,
      column: 9
    },
    {
      code: "$var :10px;",
      fixed: "$var : 10px;",
      description: "$var :10px;",
      message: messages.expectedAfter(),
      line: 1,
      column: 6
    },
    {
      code: "$var :  10px;",
      fixed: "$var : 10px;",
      description: "$var :  10px;",
      message: messages.expectedAfter(),
      line: 1,
      column: 6
    },
    {
      code: "$var :\t10px;",
      fixed: "$var : 10px;",
      description: "$var :\t10px;",
      message: messages.expectedAfter(),
      line: 1,
      column: 6
    },
    {
      code: "$var :\n10px;",
      fixed: "$var : 10px;",
      description: "$var :\n10px;",
      message: messages.expectedAfter(),
      line: 1,
      column: 6
    },
    {
      code: "$var :\r\n10px;",
      fixed: "$var : 10px;",
      description: "$var :\r\n10px;",
      message: messages.expectedAfter(),
      line: 1,
      column: 6
    },
    {
      code: "$var:10px;",
      fixed: "$var: 10px;",
      description: "$var:10px;",
      message: messages.expectedAfter(),
      line: 1,
      column: 5
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
      code: "a { $var:10px }",
      description: "a { $var:10px }"
    },
    {
      code: "a { $var :10px }",
      description: "a { $var :10px }"
    },
    {
      code: "a { $var\n:10px }",
      description: "a { $var\n:10px }"
    },
    {
      code: "a { $var\r\n:10px }",
      description: "a { $var\r\n:10px }"
    },
    {
      code: "$map:(key: value)",
      description: "$map:(key: value)"
    }
  ],

  reject: [
    {
      code: "a { $var : 10px; }",
      fixed: "a { $var :10px; }",
      description: "a { $var : 10px; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var:  10px; }",
      fixed: "a { $var:10px; }",
      description: "a { $var:  10px; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 9
    },
    {
      code: "a { $var :\t10px; }",
      fixed: "a { $var :10px; }",
      description: "a { $var :\t10px; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :\n10px; }",
      fixed: "a { $var :10px; }",
      description: "a { $var :\n10px; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :\r\n10px; }",
      fixed: "a { $var :10px; }",
      description: "a { $var :\r\n10px; }",
      message: messages.rejectedAfter(),
      line: 1,
      column: 10
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-single-line"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: "a { $var: 10px }",
      description: "a { $var: 10px }"
    },
    {
      code: "$transition: color 1s,\n\twidth 2s;",
      description: "$transition: color 1s,\n\twidth 2s;"
    },
    {
      code: "$transition:color 1s,\n\twidth 2s;",
      description: "$transition:color 1s,\n\twidth 2s;"
    },
    {
      code: "$transition:color 1s,\r\n\twidth 2s;",
      description: "$transition:color 1s,\r\n\twidth 2s;"
    },
    {
      code: "a { $transition:\tcolor 1s,\n\twidth 2s; }",
      description: "a { $transition:\tcolor 1s,\n\twidth 2s; }"
    }
  ],

  reject: [
    {
      code: "a { $var :10px; }",
      fixed: "a { $var : 10px; }",
      description: "a { $var :10px; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :  10px; }",
      fixed: "a { $var : 10px; }",
      description: "a { $var :  10px; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :\t10px; }",
      fixed: "a { $var : 10px; }",
      description: "a { $var :\t10px; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :\n10px; }",
      fixed: "a { $var : 10px; }",
      description: "a { $var :\n10px; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var :\r\n10px; }",
      fixed: "a { $var : 10px; }",
      description: "a { $var :\r\n10px; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 10
    },
    {
      code: "a { $var:10px; }",
      fixed: "a { $var: 10px; }",
      description: "a { $var:10px; }",
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["at-least-one-space"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: "a { width:10px }",
      description: "Not an SCSS var, ignored: a { width:10px }"
    },
    {
      code: "a { $var: 10px }",
      description: "a { $var: 10px }"
    },
    {
      code: "a { $var : 10px }",
      description: "a { $var : 10px }"
    },
    {
      code: "a { $var\n: 10px }",
      description: "a { $var\n: 10px }"
    },
    {
      code: "a { $var\r\n: 10px }",
      description: "a { $var\r\n: 10px }"
    },
    {
      code: "$var: 10px;",
      description: "$var: 10px;"
    },
    {
      code: "$var : 10px",
      description: "$var : 10px"
    },
    {
      code: "$var: url(data:application/font-woff;...);",
      description: "Data URI: $var: url(data:application/font-woff;...);"
    },
    {
      code: "@function ($a:10) {}",
      description:
        "Default in a function definition, ignored: @function ($a: 10)"
    },
    {
      code: "$var:    10px",
      description: "$var:    10px"
    }
  ],

  reject: [
    {
      code: "a { $var :10px; }",
      fixed: "a { $var : 10px; }",
      description: "a { $var :10px; }",
      message: messages.expectedAfterAtLeast(),
      line: 1,
      column: 10
    },
    {
      code: "$var :10px;",
      fixed: "$var : 10px;",
      description: "$var :10px;",
      message: messages.expectedAfterAtLeast(),
      line: 1,
      column: 6
    },
    {
      code: "$var:10px;",
      fixed: "$var: 10px;",
      description: "$var:10px;",
      message: messages.expectedAfterAtLeast(),
      line: 1,
      column: 5
    }
  ]
});
