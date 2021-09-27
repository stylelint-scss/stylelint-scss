import { messages, ruleName } from "..";

// always
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `a {
      $var1: 100px;
    }`,
      description: "$var first inside a rule."
    },
    {
      code: `a {
      $var1: 100px;
      width: 100px;
      height: 100px;
    }`,
      description: "$var first inside a rule followed by properties."
    },
    {
      code: `a {
      $var1: 100px;
      $var1: 100px;
    }`,
      description: "Two $var-s first inside a rule."
    },
    {
      code: `a {
      $var1: 100px;

      $var1: 100px;
    }`,
      description: "Two $var-s first inside a rule, empty line between them."
    },
    {
      code: `a {

      $var1: 100px;
      $var1: 100px;
    }`,
      description: "Two $var-s first inside a rule, empty line before them."
    },
    {
      code: "$var1: 100px;",
      description: "$var in root."
    },
    {
      code: `
      $var1: 100px;
      @import '1.css';
    `,
      description: "$var first in root."
    },
    {
      code: `@media (min-width: 100px) {
      $var: 1000px;
    }`,
      description: "$var first inside a media query."
    },
    {
      code: `@function function-name($base) {
      $var: 1000px;
    }`,
      description: "$var first inside a `@function`."
    },
    {
      code: `@mixin mixin-name {
      $var: 1000px;
    }`,
      description: "$var first inside a `@mixin`."
    },
    {
      code: `@at-root .class {
      $var: 1000px;
    }`,
      description: "$var first inside an `@at-root`."
    },
    {
      code: `@if $direction == up {
      $var: 1000px;
    }`,
      description: "$var first inside an `@if`."
    },
    {
      code: `@if $direction == up {
      width: 100px;
    } @else {
      $var: 1000px;
    }`,
      description: "$var first inside an `@else`."
    },
    {
      code: `@each $size in $sizes {
      $var: 1000px;
    }`,
      description: "$var first inside an `@each` rule."
    },
    {
      code: `@for $i from 1 through 3 {
      $var: 1000px;
    }`,
      description: "$var first inside a `@for` rule."
    },
    {
      code: `@while $value > $base {
      $var: 1000px;
    }`,
      description: "$var first inside a `@while` rule."
    }
  ],

  reject: [
    {
      code: `a {
      width: 100px;
      $var1: 100px;
    }`,
      description: "$var inside a rule, not first.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `
      a {
        b { }

        $var1: 100px;
      }
    `,
      description: "$var following nested selector.",
      message: messages.expected,
      line: 5,
      column: 9
    },
    {
      code: `
      a {
        // Comment
        $var1: 100px;
      }
    `,
      description: "$var following a comment.",
      message: messages.expected,
      line: 4,
      column: 9
    },
    {
      code: `@media (min-width: 100px) {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside a media query.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `@function function-name($base) {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside a `@function`.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `@mixin mixin-name {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside a `@mixin`.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `@at-root .class {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside an `@at-root`.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `@if $direction == up {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside an `@if`.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `@if $direction == up {
      width: 100px;
    } @else {
      height: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside an `@else`.",
      message: messages.expected,
      line: 5,
      column: 7
    },
    {
      code: `@each $size in $sizes {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside an `@each` rule.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `@for $i from 1 through 3 {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside a `@for` rule.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `@while $value > $base {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside a `@while` rule.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `
      @import '1.css';
      $var1: 100px;

      a { }
    `,
      description: "$var in root, preceded by import, followed by selector.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `
      @import '1.css';
      $var1: 100px;
    `,
      description: "$var in root, preceded by import.",
      message: messages.expected,
      line: 3,
      column: 7
    },
    {
      code: `
      @use "sass:color";

      $primary-color: #f26e21 !default;
      $secondary-color: color.change($primary-color, $alpha: 0.08) !default;
    `,
      description: "variables in root, preceded by @use.",
      message: messages.expected,
      line: 4,
      column: 7
    },
    {
      code: `
      @forward "src/list";

      $var1: 100px;
    `,
      description: "$var in root, preceded by @forward.",
      message: messages.expected,
      line: 4,
      column: 7
    }
  ]
});

testRule({
  ruleName,
  config: [true, { except: ["root"] }],
  syntax: "scss",

  accept: [
    {
      code: `
      a { }
      $var1: 100px;
    `,
      description: "$var in root, preceded by selector."
    },
    {
      code: `
      a { }
      $var1: 100px;
      b { }
    `,
      description: "$var in root, preceded and followed by selectors."
    }
  ]
});

testRule({
  ruleName,
  config: [true, { except: ["at-rule"] }],
  syntax: "scss",

  accept: [
    {
      code: `@at-root .class {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var in at-rule, preceded by selector."
    }
  ]
});

testRule({
  ruleName,
  config: [true, { except: ["function"] }],
  syntax: "scss",

  accept: [
    {
      code: `@function function-name($numbers1, $numbers2) {
      $var1: 1;

      @each $number in $numbers1 {
        $var1: $var1 + $number;
      }

      $var: 2;

      @each $number in $numbers2 {
        $var2: $var2 + $number;
      }

      @return $var1 + $var2;
    }`,
      description: "$var in function, preceded by selector."
    }
  ]
});

testRule({
  ruleName,
  config: [true, { except: ["mixin"] }],
  syntax: "scss",

  accept: [
    {
      code: `@mixin mixin-name {
      width: 100px;
      $var: 1000px;
      height: $var1;
    }`,
      description: "$var in mixin, preceded by selector."
    }
  ]
});

testRule({
  ruleName,
  config: [true, { except: ["if-else"] }],
  syntax: "scss",

  accept: [
    {
      code: `@if $direction == up {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var in @if, preceded by selector."
    },
    {
      code: `@if $direction == up {
      width: 100px;
    } @else {
      height: 100px;
      $var: 1000px;
    }`,
      description: "$var in @else, preceded by selector."
    },
    {
      code: `@if $direction == up {
      width: 100px;
      $var1: 1000px;
    } @else {
      height: 100px;
      $var2: 1000px;
    }`,
      description: "$var in @if and @else, both preceded by selector."
    }
  ]
});

testRule({
  ruleName,
  config: [true, { except: ["loops"] }],
  syntax: "scss",

  accept: [
    {
      code: `@each $size in $sizes {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside an `@each` rule."
    },
    {
      code: `@for $i from 1 through 3 {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside a `@for` rule."
    },
    {
      code: `@while $value > $base {
      width: 100px;
      $var: 1000px;
    }`,
      description: "$var not first inside a `@while` rule."
    }
  ]
});

testRule({
  ruleName,
  config: [true, { ignore: ["imports"] }],
  syntax: "scss",

  accept: [
    {
      code: `
      @import '1.css';
      $var1: 100px;

      a { }
    `,
      description: "$var in root, preceded by import, followed by selector."
    },
    {
      code: `
      @import '1.css';
      $var1: 100px;
    `,
      description: "$var in root, preceded by import."
    },
    {
      code: `
      @use "sass:color";

      $primary-color: #f26e21 !default;
      $secondary-color: color.change($primary-color, $alpha: 0.08) !default;
    `,
      description: "variables in root, preceded by @use."
    },
    {
      code: `
      @forward "src/list";

      $var1: 100px;
    `,
      description: "$var in root, preceded by @forward."
    }
  ],

  reject: [
    {
      code: `a {
      width: 100px;
      @import url("path/_file.css");
      $var1: 100px;
    }`,
      description: "$var inside a rule, preceded by an import and not first.",
      message: messages.expected,
      line: 4,
      column: 7
    },
    {
      code: `
      a {
        b { }

        @import url("path/_file.css");
        $var1: 100px;
      }
    `,
      description: "$var following import and nested selector.",
      message: messages.expected,
      line: 6,
      column: 9
    }
  ]
});

testRule({
  ruleName,
  config: [true, { ignore: ["comments"] }],
  syntax: "scss",

  accept: [
    {
      code: `a {
      // Comment
      $var2: 100px;
    }`,
      description: "$var inside a rule following a //-comment."
    },
    {
      code: `a {
      $var1: 100px;
      // Comment
      $var2: 100px;
    }`,
      description: "Two $var-s inside a rule, //-comment between them."
    },
    {
      code: `a {
      $var1: 100px;
      // Comment
      // Comment
      // Comment
      $var2: 100px;
    }`,
      description:
        "Two $var-s inside a rule, multiple //-comments between them."
    },
    {
      code: `a {
      $var1: 100px;

      /* Comment */
      $var2: 100px;
    }`,
      description:
        "Two $var-s inside a rule, CSS-comment and space between them."
    },
    {
      code: `a {
      $var1: 100px;

      /* Comment
         Comment
         Comment */

      $var2: 100px;
    }`,
      description:
        "Two $var-s inside a rule, empty lines and multi-line CSS-comment between them."
    }
  ],

  reject: [
    {
      code: `a {
      width: 100px;
      // Comment
      $var1: 100px;
    }`,
      description: "$var inside a rule, preceded by //-comment and not first.",
      message: messages.expected,
      line: 4,
      column: 7
    },
    {
      code: `
      a {
        b { }

        /* Comment */
        $var1: 100px;
      }
    `,
      description: "$var following comment and nested selector.",
      message: messages.expected,
      line: 6,
      column: 9
    },
    {
      code: `
      a {
        $var1: 100px;

        b { }

        // Comment
        $var2: 100px;
      }
    `,
      description:
        "$var preceded by comment, a nested selector and another $var.",
      message: messages.expected,
      line: 8,
      column: 9
    }
  ]
});

testRule({
  ruleName,
  config: [true, { ignore: ["comments", "imports"], except: ["root"] }],
  syntax: "scss",

  accept: [
    {
      code: `a {
      @import url("path/_file.css");
      // Comment
      $var2: 100px;
    }`,
      description: "$var inside a rule following a //-comment and an import."
    },
    {
      code: `
      @import url("path/_file.css");
      // Comment
      $var2: 100px;
    `,
      description: "$var in root following a //-comment and an import."
    },
    {
      code: `a {
      $var1: 100px;
      // Comment
      @import url("path/_file.css");
      /* Comment */
      $var2: 100px;
    }`,
      description:
        "Two $var-s inside a rule, multiple comments and an import between them."
    },
    {
      code: `a {
      @import url("path/_file1.css");
      @import url("path/_file2.css");
      $var1: 100px;
    }`,
      description: "$var preceded by two imports inside a rule."
    },
    {
      code: `
      @import url("path/_file1.css");
      @import url("path/_file2.css");
      $var1: 100px;
    `,
      description: "$var preceded by two imports in root."
    }
  ],

  reject: [
    {
      code: `a {
      width: 100px;
      @import url("path/_file1.css");
      // Comment
      $var1: 100px;
    }`,
      description:
        "$var inside a rule, preceded by //-comment, an import and not first.",
      message: messages.expected,
      line: 5,
      column: 7
    }
  ]
});
