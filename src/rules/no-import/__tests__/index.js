"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
        @use "file";
      `,
      description: "`@use` declarations"
    },
    {
      code: `
        @forward "file";
      `,
      description: "`@forward` declarations"
    }
  ],

  reject: [
    {
      code: `
        @import "file";
      `,
      line: 2,
      column: 9,
      endLine: 2,
      endColumn: 24,
      message: messages.rejected('@import "file"'),
      description: "No regular imports"
    },
    {
      code: `
        @import "file.css";
      `,
      line: 2,
      column: 9,
      endLine: 2,
      endColumn: 28,
      message: messages.rejected('@import "file.css"'),
      description: "No css imports"
    },
    {
      code: `
        @import "file.scss";
      `,
      line: 2,
      column: 9,
      endLine: 2,
      endColumn: 29,
      message: messages.rejected('@import "file.scss"'),
      description: "No imports with extensions"
    },
    {
      code: `
        @import "_partial";
      `,
      line: 2,
      column: 9,
      endLine: 2,
      endColumn: 28,
      message: messages.rejected('@import "_partial"'),
      description: "No partial imports"
    },
    {
      code: `
        @import "http://file.scss";
      `,
      line: 2,
      column: 9,
      endLine: 2,
      endColumn: 36,
      message: messages.rejected('@import "http://file.scss"'),
      description: "No web imports"
    },
    {
      code: `
        @import url("file");
      `,
      line: 2,
      column: 9,
      endLine: 2,
      endColumn: 29,
      message: messages.rejected('@import url("file")'),
      description: "No url imports"
    }
  ]
});
