import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: ["always-last-in-chain"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      @if ($x) {}
    }`,
      description: "does not use the != null format"
    },
    {
      code: `a {
      @if not ($x) {}
    }`,
      description: "does not use the == null format"
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == null) {}
    }`,
      description: "uses the == null format",
      message: messages.expected,
      line: 4
    },
    {
      code: `a {
      @if ($x != null) {}
    }`,
      description: "uses the != null format",
      message: messages.expected,
      line: 4
    }
  ]
});
