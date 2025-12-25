"use strict";

const { messages, ruleName } = require("..");

// Always: Import
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @import "fff.scss";
    `,
      description: "Import, fix with no redundant path."
    },
    {
      code: `
      @use "fff.scss";
    `,
      description: "Use, fix with no redundant path."
    },
    {
      code: `
      @forward "fff.scss";
    `,
      description: "Forward, fix with no redundant path."
    }
  ],
  reject: [
    {
      code: `
      @import "./fff.scss";
    `,
      line: 2,
      column: 7,
      message: messages.rejected('"./fff.scss"'),
      description: "Import, redundant path."
    },
    {
      code: `
      @use "./fff.scss";
    `,
      line: 2,
      column: 7,
      message: messages.rejected('"./fff.scss"'),
      description: "Use, redundant path."
    },
    {
      code: `
      @forward "./fff.scss";
    `,
      line: 2,
      column: 7,
      message: messages.rejected('"./fff.scss"'),
      description: "Forward, redundant path."
    },
    {
      code: `
       @import "../.././common.scss";
    `,
      line: 2,
      column: 8,
      message: messages.rejected('"../.././common.scss"'),
      description: "Import, redundant path in the middle."
    }
  ]
});

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @import "fff.scss";
    `,
      description: "Import, fix with no redundant path."
    },
    {
      code: `
      @use "fff.scss";
    `,
      description: "Use, fix with no redundant path."
    },
    {
      code: `
      @forward "fff.scss";
    `,
      description: "Forward, fix with no redundant path."
    }
  ],
  reject: [
    {
      code: `
      @import "./fff.scss";
    `,
      fixed: `
      @import "fff.scss";
    `,
      line: 2,
      column: 7,
      message: messages.rejected('"./fff.scss"'),
      description: "Import, fix."
    },
    {
      code: `
      @use "./fff.scss";
    `,
      fixed: `
      @use "fff.scss";
    `,
      line: 2,
      column: 7,
      message: messages.rejected('"./fff.scss"'),
      description: "use, fix."
    },
    {
      code: `
      @forward "./fff.scss";
    `,
      fixed: `
      @forward "fff.scss";
    `,
      line: 2,
      column: 7,
      message: messages.rejected('"./fff.scss"'),
      description: "Forward, fix."
    }
  ]
});
