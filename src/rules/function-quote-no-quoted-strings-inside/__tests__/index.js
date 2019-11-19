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
          font-family: quote(Helvetica);
        }
      `,
      description: "accepts strings without quotes"
    },
    {
      code: `
        $font: Helvetica;
        p {
          font-family: quote($font);
        }
      `,
      description: "accepts variables representing strings that are unquoted."
    }
  ],

  reject: [
    {
      code: `
        p {
          font-family: quote("Helvetica");
        }
      `,
      description: "does not accept strings with quotes",
      message: messages.rejected,
      line: 3,
      fixed: `
        p {
          font-family: "Helvetica";
        }
      `
    },
    {
      code: `
        $font: "Helvetica";
        p {
          font-family: quote($font);
        }
      `,
      description:
        "does not accept variables representing strings that are quoted.",
      line: 4,
      fixed: `
        $font: "Helvetica";
        p {
          font-family: $font;
        }
      `
    }
  ]
});
