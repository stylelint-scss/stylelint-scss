import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: ["always-last-in-chain"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      @if ($x == 1) {}
      width: 10px;
    }`,
      description: "always-last-in-chain (no @else, has newline after)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) {

      } width: 10px;
    }`,
      fixed: `a {
      @if ($x == 1) {

      }
width: 10px;
    }`,
      description:
        "always-last-in-chain (has decl on the same line as its closing brace).",
      message: messages.expected,
      line: 4
    }
  ]
});
