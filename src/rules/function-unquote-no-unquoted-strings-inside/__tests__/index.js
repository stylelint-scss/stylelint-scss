"use strict";

const { rule, ruleName, messages } = require("..");

// always-intermediate
testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
        p {
          font-family: unquote("Helvetica");
        }
      `,
      description: "accepts strings with quotes"
    },
    {
      code: `
        $font: "Helvetica";
        p {
          font-family: unquote($font);
        }
      `,
      description: "accepts variables representing strings that are quoted."
    }
  ],

  reject: [
    {
      code: `
        p {
          font-family: unquote(Helvetica);
        }
      `,
      description: "does not accept strings without quotes",
      message: messages.rejected,
      line: 3,
      fixed: `
        p {
          font-family: Helvetica;
        }
      `
    },
    {
      code: `
        $font: Helvetica;
        p {
          font-family: unquote($font);
        }
      `,
      description:
        "does not accept variables representing strings that are quoted.",
      line: 4,
      fixed: `
        $font: Helvetica;
        p {
          font-family: $font;
        }
      `
    }
  ]
});
