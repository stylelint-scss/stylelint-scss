import rule from "../index.js";

const { ruleName, messages } = rule;

// always-intermediate
testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `a {
      @if ($x == 1) {
        // ...
      } @else if ($x == 2) {
        // ...
      } @else {}
    }`,
      description: "never (no newline for @else)."
    },
    {
      code: `a {
     @if ($x == 1) {
        // ...
      }
      @else ($x == 2) {
        // ...
      }
    }`,
      description: "never (no empty line for @else)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) {
        // ...
      }

      @else {}
    }`,
      fixed: `a {
      @if ($x == 1) {
        // ...
      } @else {}
    }`,
      description: "never (one empty line before @else)",
      message: messages.rejected,
      line: 6,
      column: 7,
      endLine: 6,
      endColumn: 12
    },
    {
      code: "a { @if ($x == 1) { } \n\n @else if ($x == 2) { } \n @else { } }",
      fixed: "a { @if ($x == 1) { } @else if ($x == 2) { } \n @else { } }",
      description: "never (two empty lines before @else if)",
      message: messages.rejected,
      line: 3
    }
  ]
});
