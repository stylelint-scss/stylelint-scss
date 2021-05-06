import rule, { ruleName, messages } from "..";
import { sassAtRules } from "../../at-rule-no-unknown";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: sassAtRules
    .filter(rule => rule !== "import")
    .map(rule => ({
      code: `@${rule}`,
      description: `@${rule} rule`
    })),
  reject: [
    {
      code: `@import 'test'`,
      description: "@import rule with single quotes",
      message: messages.rejected,
      line: 1,
      column: 1
    },
    {
      code: `@import "test"`,
      description: "@import rule with double quotes",
      message: messages.rejected,
      line: 1,
      column: 1
    }
  ]
});
