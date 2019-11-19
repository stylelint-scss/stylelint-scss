"use strict";

const { ruleName, messages } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      p {
        $foo: 10px;
      }
    `,
      description: "Non-namespaced assignment"
    },
    {
      code: `
      p {
        a: imported.$foo;
      }
    `,
      description: "Namespaced usage"
    }
  ],

  reject: [
    {
      code: `
      p {
        imported.$foo: 10px;
      }
    `,
      line: 3,
      message: messages.rejected,
      description: "Namespaced assignment"
    }
  ]
});
