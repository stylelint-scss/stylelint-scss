"use strict";

const { messages, ruleName } = require("..");

// always-intermediate
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
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
      column: 24,
      endLine: 3,
      endColumn: 31,
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
      message: messages.rejected,
      line: 4,
      column: 24,
      endLine: 4,
      endColumn: 31,
      fixed: `
        $font: Helvetica;
        p {
          font-family: $font;
        }
      `
    }
  ]
});
