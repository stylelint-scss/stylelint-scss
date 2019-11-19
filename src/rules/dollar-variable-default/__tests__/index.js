"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: "a { color: blue }",
      description: "Basic style definition"
    },
    {
      code: "$var: 10px !default",
      description: "Global variable with !default"
    },
    {
      code: "a { $var: 10px !default }",
      description: "Local variable with !default"
    },
    {
      code: ".class { a { $var: 10px !default } }",
      description: "Nested local variable with !default"
    }
  ],

  reject: [
    {
      code: "$var: 10px",
      message: messages.expected("$var"),
      description: "Global variable without !default",
      line: 1,
      column: 1
    },
    {
      code: `
        $global: 10px !default;
        a {
          $local-var: 10px;
        }
      `,
      message: messages.expected("$local-var"),
      description: "Local variable without !default",
      line: 4,
      column: 11
    },
    {
      code: `
        $global: 10px !default;
        .class {
          a {
            $nested-var: 10px;
          }
        }
      `,
      message: messages.expected("$nested-var"),
      description: "Nested local variable without !default",
      line: 5,
      column: 13
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
      code: "a { color: blue }",
      description: "Basic style definition (ignoring local variables)"
    },
    {
      code: "$var: 10px !default",
      description: "Global variable with !default (ignoring local variables)"
    },
    {
      code: "a { $var: 10px !default }",
      description: "Ignore local variable with !default"
    },
    {
      code: ".class { a { $var: 10px !default } }",
      description: "Ignore nested local variable with !default"
    },
    {
      code: "a { $var: 10px }",
      description: "Ignore local variable without !default"
    },
    {
      code: ".class { a { $var: 10px } }",
      description: "Ignore nested local variable without !default"
    }
  ],

  reject: [
    {
      code: "$var: 10px",
      message: messages.expected("$var"),
      description:
        "Ignore local variable, fail global variable without !default",
      line: 1,
      column: 1
    }
  ]
});
