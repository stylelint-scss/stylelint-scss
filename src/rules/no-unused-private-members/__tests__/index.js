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
      @mixin _reset-list($n1) {
        margin: $n1;
      }
      
      nav ul {
        @include _reset-list(2px);
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
      @import 'foo';

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
      `
    },
    {
      code: `
      $-radius: 3px;
      
      .action-buttons {
        margin: map.get($-radius);
      }
      `,
      description: "map.get uses variable"
    },
    {
      code: `
      $_sys-color: #0000;
      $_a-color: #fff;
      $_b-color: map.get($_sys-color);

      .btn {
          @include button_text_theme.theme (
            (
            'label-text-color': $_b-color,
            'label-text-color': $_a-color
            )
          );
      }`,
      description: "Is in theme declaration"
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
    },
    {
      code: `
      $_a: 5px * 2;
      $_b: 900;
      $_c: 400;

      .chip {
        @include header($_b);
        @include column($_a);
        @include footer();
      }`,
      message: messages.expected("$_c"),
      line: 4,
      column: 7,
      description: "Variables used as function parameters"
    },
    {
      code: `
      $_a: 5px * 2;
      $_b: 900;
      
      .action-buttons {
        margin: map.get($_a);
      }
      `,
      message: messages.expected("$_b"),
      line: 3,
      column: 7,
      description: "map.get uses variable"
    },
    {
      code: `
      $_sys-color: #0000;
      $_a-color: #fff;
      $_b-color: map.get($_sys-color);

      .btn {
          @include button_text_theme.theme (
            (
            'label-text-color': $_b-color,
            'label-text-color': #000
            )
          );
      }`,
      message: messages.expected("$_a-color"),
      line: 3,
      column: 7,
      description: "Is in theme declaration"
    }
  ]
});
