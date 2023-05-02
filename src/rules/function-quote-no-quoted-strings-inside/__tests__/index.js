"use strict";

const { messages, ruleName } = require("../index.js");

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
      column: 24,
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
      column: 24,
      message: messages.rejected,
      fixed: `
        $font: "Helvetica";
        p {
          font-family: $font;
        }
      `
    },
    {
      code: `
      $area-row: "1";
      @if $template {
        $template: $template quote($area-row);
      }
      @else {
        $template: quote($area-row);
      }
      `,
      description: "issue #633",
      warnings: [
        {
          column: 30,
          endColumn: 31,
          endLine: 4,
          line: 4,
          message: messages.rejected
        },
        {
          column: 20,
          endColumn: 21,
          endLine: 7,
          line: 7,
          message: messages.rejected
        }
      ],
      fixed: `
      $area-row: "1";
      @if $template {
        $template: $template $area-row;
      }
      @else {
        $template: $area-row;
      }
      `
    }
  ]
});
