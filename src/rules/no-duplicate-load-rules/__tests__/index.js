import rule from "../index.js";

const { ruleName, messages } = rule;

// @import
testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '@import "a.css";'
    },
    {
      code: "@import url('a.css');"
    },
    {
      code: "@import url(a.css);"
    },
    {
      code: '@import url("a.css") projection, tv;'
    },
    {
      code: "@import 'a.css'; @import 'b.css';"
    },
    {
      code: "@import url('a.css') projection; @import url('a.css') tv;"
    },
    {
      code: '@import "a.css" screen; @import "b.css" tv; @import "a.css" tv;'
    },
    {
      code: '@IMPORT "a.css"; @ImPoRt "b.css";'
    },
    {
      code: '@import "a.css" supports(display: flex) tv; @import "a.css" layer tv;'
    },
    {
      code: '@import "a.css" supports(display: flex); @import "a.css" layer;'
    },
    {
      code: '@import "a.css" supports(display: flex) tv; @import "a.css" supports(display: grid) tv;'
    }
  ],

  reject: [
    {
      code: "@import 'a.css'; @import 'a.css';",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 18,
      endLine: 1,
      endColumn: 33
    },
    {
      code: '@import url("a.css"); @import url("a.css");',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 23,
      endLine: 1,
      endColumn: 43
    },
    {
      code: "@import \"a.css\";\n@import 'a.css';",
      message: messages.rejected(`a.css`),
      line: 2,
      column: 1,
      endLine: 2,
      endColumn: 16
    },
    {
      code: "@import \"a.css\"; @import 'b.css'; @import url(a.css);",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 35,
      endLine: 1,
      endColumn: 53
    },
    {
      code: "@import url('a.css') tv; @import 'a.css' tv;",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 26
    },
    {
      code: "@import url('a.css') tv, projection; @import 'a.css' projection, tv;",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 38
    },
    {
      code: "@import url('a.css') tv, projection; @import 'a.css' projection, screen, tv;",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 38
    },
    {
      code: "@import url('a.css') tv, projection; @import 'a.css' screen, tv;",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 38
    },
    {
      code: "@import url('a.css') /* a comment */ tv; @import 'a.css' tv /* a comment */;",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 42
    },
    {
      code: '@import "a.css" (min-width : 500px);@import url(a.css) (  min-width:500px   );',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 37
    },
    {
      code: '@import "a.css" tv, (min-width : 500px);@import url(a.css) (  min-width:500px   ), tv;',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 41
    },
    {
      code: "@IMPORT 'a.css'; @ImPoRt 'a.css';",
      message: messages.rejected(`a.css`),
      line: 1,
      column: 18
    },
    {
      code: '@import url("a.css") layer; @import url("a.css") layer;',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 29,
      endLine: 1,
      endColumn: 55
    },
    {
      code: '@import url("a.css") layer(base); @import url("a.css") layer(base);',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 35,
      endLine: 1,
      endColumn: 67
    },
    {
      code: '@import url("a.css") layer(base) supports(display: grid); @import url("a.css") layer(base) supports(display: grid);',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 59,
      endLine: 1,
      endColumn: 115
    },
    {
      code: '@import url("a.css") supports(display: grid); @import url("a.css") supports(display: grid);',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 47,
      endLine: 1,
      endColumn: 91
    },
    {
      code: '@import url("a.css") layer tv; @import url("a.css") layer tv;',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 32,
      endLine: 1,
      endColumn: 61
    },
    {
      code: '@import url("a.css") layer(base) tv; @import url("a.css") layer(base) tv;',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 38,
      endLine: 1,
      endColumn: 73
    },
    {
      code: '@import url("a.css") layer(base) supports(display: grid) tv; @import url("a.css") layer(base) supports(display: grid) tv;',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 62,
      endLine: 1,
      endColumn: 121
    },
    {
      code: '@import url("a.css") layer(base) supports(display: grid) screen, tv; @import url("a.css") layer(base) supports(display: grid) tv;',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 70,
      endLine: 1,
      endColumn: 129
    },
    {
      code: '@import url("a.css") layer; @import url("a.css") layer;',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 29,
      endLine: 1,
      endColumn: 55
    },
    {
      code: '@import url("a.css") supports(display: grid); @import url("a.css") supports(display: grid);',
      message: messages.rejected(`a.css`),
      line: 1,
      column: 47,
      endLine: 1,
      endColumn: 91
    }
  ]
});

// @use
testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '@use "a";'
    },
    {
      code: '@use "a";\n@use "b";'
    },
    {
      code: `
      @use "sass:map" as abc;
      @use "sass:math" as xyz;
      `
    },
    {
      code: `
      @use 'library' with (
        $black: #222,
        $border-radius: 0.1rem
      );
      @use 'lib' with ($blue: #333);`
    }
  ],
  reject: [
    {
      code: `
      @use "a.css";
      @use "a.css";
      `,
      message: messages.rejected("a.css"),
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 19
    },
    {
      code: `
      @use "a";
      @use "a";
      `,
      message: messages.rejected("a"),
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 15
    },
    {
      code: `
      @use "sass:math" as abc;
      @use "sass:math" as xyz;
      `,
      message: messages.rejected("sass:math"),
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 30
    },
    {
      code: `
      @use 'library' with (
        $black: #222,
        $border-radius: 0.1rem
      );
      @use 'library' with ($blue: #333);`,
      message: messages.rejected("library"),
      line: 6,
      column: 7,
      endLine: 6,
      endColumn: 40
    }
  ]
});

// @forward
testRule({
  ruleName,
  config: [true],

  accept: [
    {
      code: '@forward "src/list";'
    },
    {
      code: '@forward "a";\n@forward "b";'
    },
    {
      code: `
      @forward "a" as list-*;
      @forward "b" as list-2;
      `
    },
    {
      code: `
      @forward "a" hide list-reset, $horizontal-list-gap;
      @forward "b" hide $vertical-list-gap;
      `
    },
    {
      code: `
      @forward "a" show list-reset, $horizontal-list-gap;
      @forward "b" show $vertical-list-gap;
      `
    },
    {
      code: `
      @forward 'a' with (
        $black: #222,
        $border-radius: 0.1rem
      );
      @forward 'b' with ($blue: #333);`
    },
    {
      code: `
      @forward "src/list" as list-*;
      @forward "src/list" as list-2;
      `
    },
    {
      code: `
      @forward "a" hide list-reset, $horizontal-list-gap;
      @forward "a" hide $vertical-list-gap;`
    },
    {
      code: `
      @forward "a" show list-reset, $horizontal-list-gap;
      @forward "a" show $vertical-list-gap;
      `
    },
    {
      code: `
      @forward 'src/list' with (
        $black: #222,
        $border-radius: 0.1rem
      );
      @forward 'src/list' with ($blue: #333);`
    },
    {
      code: `
      @use 'src/list';
      @forward 'src/list' with ($blue: #333);`
    },
    {
      code: `
      @use 'src/list';
      @forward 'src/list';
      `
    }
  ],
  reject: [
    {
      code: '@forward "src/list";\n@forward "src/list";',
      message: messages.rejected("src/list"),
      line: 2,
      column: 1,
      endLine: 2,
      endColumn: 20
    },
    {
      code: `
      @forward "src/list" as list-*;
      @forward "src/list" as list-*;
      `,
      message: messages.rejected("src/list"),
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 36
    },
    {
      code: `
      @forward "a" hide list-reset, $horizontal-list-gap;
      @forward "a" hide list-reset, $horizontal-list-gap;
      `,
      message: messages.rejected("a"),
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 57
    },
    {
      code: `
      @forward "a" show list-reset, $horizontal-list-gap;
      @forward "a" show list-reset, $horizontal-list-gap;
      `,
      message: messages.rejected("a"),
      line: 3,
      column: 7,
      endLine: 3,
      endColumn: 57
    },
    {
      code: `
      @forward 'src/list' with (
        $black: #222,
        $border-radius: 0.1rem
      );
      @forward 'src/list' with (
        $black: #222,
        $border-radius: 0.1rem
      );`,
      message: messages.rejected("src/list"),
      line: 6,
      column: 7,
      endLine: 9,
      endColumn: 8
    }
  ]
});
