import rule, { ruleName, messages } from "..";

// always-intermediate
testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
        p {
          font-family: quote(Helvetica);
        }
      `,
      description: "accepts strings without quotes"
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
      line: 3
    }
  ]
});
