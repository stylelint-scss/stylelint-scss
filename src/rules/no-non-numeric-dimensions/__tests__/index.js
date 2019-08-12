import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",
  accept: [
    {
      code: `
      p {
        padding: "1" * 1px;
      }
      `,
      description: "Accepts proper value interpolation"
    }
  ],
  reject: [
    {
      code: `
      p {
        padding: #{value}px;
      }
      `,
      messages: messages.rejected,
      description: "Rejects interpolation with a unit"
    }
  ]
});
