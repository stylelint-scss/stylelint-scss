import { messages, ruleName } from "..";

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
    }
  ]
});
