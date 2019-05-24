import rule, { ruleName, messages } from "..";

// always-intermediate
testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  fix: false,

  accept: [
    {
      code: `quote(Helvetica);`,
      description: "accepts strings without quotes"
    }
  ],

  reject: [
    {
      code: `quote("Helvetica");`,
      description: "does not accept strings with quotes",
      message: messages.rejected,
      line: 1
    }
  ]
});
