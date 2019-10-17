import rule, { ruleName, messages } from "..";

// always-intermediate
testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
        @forward "src/list";
        @use "src/list"
      `,
      description: "accepts forward statements that are before use statements"
    }
  ],

  reject: [
    {
      code: `
        @use "src/list"
        @forward "src/list"
      `,
      description:
        "does not accept use statements that are before forward statements",
      message: messages.rejected,
      line: 2
    }
  ]
});
