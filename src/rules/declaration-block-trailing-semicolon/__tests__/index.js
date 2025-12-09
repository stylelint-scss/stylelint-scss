"use strict";

const { ruleName, messages } = require("..");

// testRule({
//   ruleName,
//   customSyntax: "postcss-scss",
//   config: [`always`],
//   accept: [
//     {
//       code:
//       `div {
//         border: solid {
//           width: 1px 1px 1px 7px;
//         }
//       }`,
//       description: `nested property`
//     },
//   ]
// })

testRule({
  ruleName,
  customSyntax: "postcss-scss",
  config: [`always`],

  accept: [
    {
      code: `a { color: pink; }`,
      description: `single declaration block with trailing semicolon`
    },
    {
      code: `a { background: orange; color: pink; }`,
      description: `multi declaration block with trailing semicolon`
    },
    {
      code: `a { &:hover { color: pink; }}`,
      description: `nesting without first-level decl`
    },
    {
      code: `a { color: red; &:hover { color: pink; }}`,
      description: `nesting with first-level decl`
    },
    {
      code: `div {
        border: {
          width: 1px 1px 1px 7px;
        }
      }`,
      description: `nested property`
    },
    {
      code: `div {
        border: solid #000 {
          width: 1px 1px 1px 7px;
        }
        height: auto;
      }`,
      description: `shorthand value and nested property`
    }
  ],

  reject: [
    {
      code: `a { color: pink }`,
      description: `single declaration block without trailing semicolon`,
      message: messages.expected,
      line: 1,
      column: 15
    },
    {
      code: `a { background: orange; color: pink }`,
      description: `multi declaration block without trailing semicolon`,
      message: messages.expected,
      line: 1,
      column: 35
    },
    {
      code: `a { &:hover { color: pink }}`,
      description: `nesting without first-level decl`,
      message: messages.expected,
      line: 1,
      column: 25
    },
    {
      code: `a { color: red; &:hover { color: pink }}`,
      description: `nesting with first-level decl`,
      message: messages.expected,
      line: 1,
      column: 37
    }
  ]
});

testRule({
  ruleName,
  customSyntax: "postcss-scss",
  config: [`always`, { ignore: `single-declaration` }],

  accept: [
    {
      code: `a { color: pink }`,
      description: `single declaration without trailing semicolon`
    },
    {
      code: `a { color: pink; }`,
      description: `single declaration with trailing semicolon`
    },
    {
      code: `@keyframes foo { from { top: 0px } to { top: 1px; } }`,
      description: `inconsistent case (with and without)`
    }
  ],

  reject: [
    {
      code: `a { background: orange; color: pink }`,
      description: `multi declaration block without trailing semicolon`,
      message: messages.expected,
      line: 1,
      column: 35
    }
  ]
});

testRule({
  ruleName,
  customSyntax: "postcss-scss",
  config: [`never`, { ignore: [`single-declaration`] }],

  accept: [
    {
      code: `a { color: pink }`,
      description: `single declaration without trailing semicolon`
    },
    {
      code: `a { color: pink; }`,
      description: `single declaration with trailing semicolon`
    },
    {
      code: `@keyframes foo { from { top: 0px } to { top: 1px; } }`,
      description: `inconsistent case (with and without)`
    }
  ]
});

testRule({
  ruleName,
  config: [`never`],

  accept: [
    {
      code: `a { color: pink }`,
      description: `single-line declaration block without trailing semicolon`
    },
    {
      code: `a { background: orange; color: pink }`,
      description: `multi-line declaration block without trailing semicolon`
    }
  ],

  reject: [
    {
      code: `a { color: pink; }`,
      description: `single-line declaration block with trailing semicolon`,
      message: messages.rejected,
      line: 1,
      column: 15
    },
    {
      code: `a { background: orange; color: pink; }`,
      description: `multi-line declaration block with trailing semicolon`,
      message: messages.rejected,
      line: 1,
      column: 35
    }
  ]
});

testRule({
  ruleName,
  config: [`always`],
  customSyntax: `postcss-scss`,

  accept: [
    {
      code: `a { @includes foo; }`,
      description: `at-rule with trailing semicolon`
    },
    {
      code: `a { @foo { color: pink; } }`,
      description: `at-rule with decl block with trailing semicolon`
    }
  ],

  reject: [
    {
      code: `a { @includes foo }`,
      description: `at-rule without trailing semicolon`,
      message: messages.expected,
      line: 1,
      column: 17
    },
    {
      code: `a { @foo { color: pink } }`,
      description: `at-rule with decl block without trailing semicolon`,
      message: messages.expected,
      line: 1,
      column: 22
    }
  ]
});

testRule({
  ruleName,
  config: [`never`],
  customSyntax: `postcss-scss`,

  accept: [
    {
      code: `a { @includes foo }`,
      description: `at-rule without trailing semicolon`
    },
    {
      code: `a { @foo { color: pink } }`,
      description: `at-rule with decl block without trailing semicolon`
    }
  ],

  reject: [
    {
      code: `a { @includes foo; }`,
      description: `at-rule with trailing semicolon`,
      message: messages.rejected,
      line: 1,
      column: 17
    },
    {
      code: `a { @foo { color: pink; } }`,
      description: `at-rule with decl block with trailing semicolon`,
      message: messages.rejected,
      line: 1,
      column: 22
    }
  ]
});
