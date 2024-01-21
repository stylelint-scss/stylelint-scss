"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @function _addNums($n1, $n2) {
        @return calc($n1 + $n2);
      }
      
      @function one($n1) {
        @return $n1;
      }
      
      .sidebar {
        margin-left: _addNums(4, 6);
      }
      `,
      description: "Private function"
    },
    {
      code: `
      @mixin _reset-list {
        margin: 0;
      }
      
      nav ul {
        @include _reset-list;
      }      
      `,
      description: "Private mixin"
    },
    {
      code: `
      $-radius: 3px;

      .rounded {
        border-radius: $-radius;
      }
      `,
      description: "Private variable"
    },
    {
      code: `
      %-toolbelt:hover {
        color: red;
      }

      .a.%-b {
        margin: 1px;
      }

      .action-buttons {
        @extend %-toolbelt;
        @extend %-b;
        color: blue;
      }
      `,
      description: "Private placeholder selector"
    },
    {
      code: `
      @import "fff"
      $-radius: 3px;

      rounded {
        border-radius: 0px;
      }
      `,
      message: messages.expected("$-radius"),
      description: "Skip files using @import",
      line: 2,
      column: 7
    }
  ],

  reject: [
    {
      code: `
      @function _addNums($n1, $n2) {
        @return calc($n1 + $n2);
      }
      
      @function _one($n1) {
        @return $n1;
      }
      
      .sidebar {
        margin-left: _addNums(4, 6);
      }
      `,
      message: messages.expected("_one"),
      description: "Private function",
      line: 6,
      column: 7
    },
    {
      code: `
      @mixin _reset-list {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      nav ul {
        margin: 0;
      }      
      `,
      message: messages.expected("_reset-list"),
      description: "Private mixin",
      line: 2,
      column: 7
    },
    {
      code: `
      $-radius: 3px;

      rounded {
        border-radius: 0px;
      }
      `,
      message: messages.expected("$-radius"),
      description: "Private variable",
      line: 2,
      column: 7
    },
    {
      code: `
      %-toolbelt {
        box-sizing: border-box;
      }
      
      %-toolbelt:hover {
        color: red;
      }
      
      .b.%-toolbelt{
        color: blue;
      }
      `,
      message: messages.expected("%-toolbelt"),
      description: "Private placeholder selector",
      line: 2,
      column: 7
    },
    {
      code: `
      %-toolbelt:hover {
        color: red;
      }

      .a.%-b {
        margin: 1px;
      }

      .action-buttons {
        @extend %-toolbelt;
        color: blue;
      }
      `,
      message: messages.expected("%-b"),
      line: 6,
      column: 7,
      description: "Private placeholder selector with class"
    }
  ]
});
