import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "@if true {}",
      description: "accepts @if with no parentheses"
    },
    {
      code: "@while true {}",
      description: "accepts @while with no parentheses"
    },
    {
      code: `@if true {}
      @else if true {}`,
      description: "accepts @else if with no parentheses"
    }
  ],

  reject: [
    {
      code: "@if(true) {}",
      fixed: "@if true {}",
      message: messages.rejected,
      description: "does not accept @if with parentheses"
    },
    {
      code: "@while(true){}",
      fixed: "@while true {}",
      message: messages.rejected,
      description: "does not accept @while with parentheses"
    },
    {
      code: `@if true {}
      @else if(true){}`,
      fixed: `@if true {}
      @else if true {}`,
      message: messages.rejected,
      description: "does not accept @else if with parentheses"
    },
    {
      code: "@if (true) {}",
      fixed: "@if true {}",
      message: messages.rejected,
      description: "doesn't allow parentheses even if there's spaces"
    }
  ]
});
