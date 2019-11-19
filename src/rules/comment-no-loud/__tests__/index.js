"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "// comment",
      description: "Double slash comments"
    },
    {
      code: "//* comment",
      description: "Double slash comments with first character as asterix"
    }
  ],
  reject: [
    {
      code: `
      /* comment */
    `,
      description: "One line with optional ending",
      message: messages.expected
    },
    {
      code: `
        /* comment line 1
           comment line 2 
        */
    `,
      description: "Multline comment with optional ending on next line",
      message: messages.expected
    }
  ]
});
