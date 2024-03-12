import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @else if ($bar) {
      }
    `,
      description: "With parentheses. Single condition"
    },
    {
      code: `
      @else if $bar {
      }
    `,
      description: "Without parentheses. Single condition"
    },
    {
      code: `
      @else if ($bar == 0 or ($bar > 5 and $bar < 10)) {
      }
    `,
      description: "With parentheses. Complex condition"
    },
    {
      code: `
      @else if ($bar == 0 or($bar > 5 and $bar < 10)) {
      }
    `,
      description: "With parentheses. Complex condition"
    },
    {
      code: `
      @else if $bar == 0 or ($bar > 5 and $bar < 10) {
      }
    `,
      description: "Without parentheses. Complex condition"
    },
    {
      code: `
      @else if $bar == 0 or($bar > 5 and $bar < 10) {
      }
    `,
      description: "Without parentheses. Complex condition"
    },
    {
      code: `
      @bar foo ($n) {
      }
    `,
      description: "Not an SCSS else statement, skipping."
    }
  ],

  reject: [
    {
      code: `
      @else
      if
      ($foo) {
      }
    `,
      fixed: `
      @else
      if ($foo) {
      }
    `,
      line: 4,
      column: 7,
      endLine: 4,
      endColumn: 8,
      message: messages.expectedBefore(),
      description: "Newline after if"
    },
    {
      code: `
      @else if($foo) {
      }
    `,
      fixed: `
      @else if ($foo) {
      }
    `,
      line: 2,
      column: 15,
      endLine: 2,
      endColumn: 16,
      message: messages.expectedBefore(),
      description: "No space before parentheses. Simple condition."
    },
    {
      code: `
      @else if  ($foo) {
      }
    `,
      fixed: `
      @else if ($foo) {
      }
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "Extra spaces after if."
    },
    {
      code: `
      @else if($bar == 0 or ($bar > 5 and $bar < 10)) {
      }
    `,
      fixed: `
      @else if ($bar == 0 or ($bar > 5 and $bar < 10)) {
      }
    `,
      line: 2,
      message: messages.expectedBefore(),
      description: "No space before parentheses. Complex condition."
    }
  ]
});

testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @else if($bar) {
      }
    `,
      description: "With parentheses. Single condition"
    },
    {
      code: `
      @else if $bar {
      }
    `,
      description: "Without parentheses. Single condition"
    },
    {
      code: `
      @else if($bar == 0 or ($bar > 5 and $bar < 10)) {
      }
    `,
      description: "With parentheses. Complex condition"
    },
    {
      code: `
      @else if($bar == 0 or($bar > 5 and $bar < 10)) {
      }
    `,
      description: "With parentheses. Complex condition"
    },
    {
      code: `
      @else if $bar == 0 or ($bar > 5 and $bar < 10) {
      }
    `,
      description: "Without parentheses. Complex condition"
    },
    {
      code: `
      @else if $bar == 0 or($bar > 5 and $bar < 10) {
      }
    `,
      description: "Without parentheses. Complex condition"
    },
    {
      code: `
      @bar foo($n) {
      }
    `,
      description: "Not an SCSS else statement, skipping."
    }
  ],

  reject: [
    {
      code: `
      @else
      if
      ($foo) {
      }
    `,
      fixed: `
      @else
      if($foo) {
      }
    `,
      line: 4,
      column: 7,
      endLine: 4,
      endColumn: 8,
      message: messages.rejectedBefore(),
      description: "Newline after if"
    },
    {
      code: `
      @else if ($foo) {
      }
    `,
      fixed: `
      @else if($foo) {
      }
    `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 17,
      message: messages.rejectedBefore(),
      description: "Single space before parentheses. Simple condition."
    },
    {
      code: `
      @else if ($bar == 0 or ($bar > 5 and $bar < 10)) {
      }
    `,
      fixed: `
      @else if($bar == 0 or ($bar > 5 and $bar < 10)) {
      }
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Single space before parentheses. Complex condition."
    },
    {
      code: `
      @else if  ($foo) {
      }
    `,
      fixed: `
      @else if($foo) {
      }
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Multiple spaces before parentheses. Simple condition."
    },
    {
      code: `
      @else if  ($bar == 0 or ($bar > 5 and $bar < 10)) {
      }
    `,
      fixed: `
      @else if($bar == 0 or ($bar > 5 and $bar < 10)) {
      }
    `,
      line: 2,
      message: messages.rejectedBefore(),
      description: "Multiple spaces before parentheses. Complex condition."
    }
  ]
});
