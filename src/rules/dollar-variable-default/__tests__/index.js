import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "$var: 10px !default",
      description: "Global variable with !default"
    },
    {
      code: "a { $var: 10px !default }",
      description: "Local variable with !default"
    }
  ],

  reject: [
    {
      code: "$var: 10px",
      message: messages.expected("$var"),
      description: "Global variable without !default"
    },
    {
      code: "a { $var: 10px }",
      message: messages.expected("$var"),
      description: "Local variable without !default"
    }
  ]
});

// "ignore" options
testRule(rule, {
  ruleName,
  config: [true, { ignore: "local" }],
  syntax: "scss",

  accept: [
    {
      code: "a { $var: 10px !default }",
      description: "Ignore local variable with !default"
    },
    {
      code: "a { $var: 10px }",
      description: "Ignore local variable without !default"
    }
  ],

  reject: [
    {
      code: "$var: 10px",
      message: messages.expected("$var"),
      description:
        "Ignore local variable, fail global variable without !default"
    }
  ]
});
