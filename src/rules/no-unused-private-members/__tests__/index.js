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

      %_toolbelt:hover {
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
      $_a: 3px;
      $_b: 1px;
      
      .action-buttons {
        margin: $-a map.get($_b);
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
    },
    {
      code: `
      $_app-bar-height: 65px;
      $-header_height: 70px;
      $_explorer-margin: 64px;
      $_total-offset: $_app-bar-height + $_header-height + $_explorer-margin;

      . b {
        margin: $_total-offset;
      }
      `,
      description: "Is in theme declaration"
    },
    {
      code: `
      @function _add-one($n1) { @return $n1 + 1 }
      @function -add-two($n1) { @return $n1 + 2 }
      @function _add_three($n1) {
      @return _add_two (
        _add-one($n1)
      )}
      
      .b {
        margin: _add-three(10);
      }`,
      description: "Is in theme declaration"
    },
    {
      code: `
      $_a: false;

      .btn {
        @if ($_a) {
          margin: 0px;
        }
      }`,
      description: "Is used in @if"
    },
    {
      code: `
      $_gm-toolbar-item-state-offset: 0.5 * 3;
      @mixin _position_offset($offset: $_gm-toolbar-item-state-offset) {
        top: $offset;
      }
      .b {
        @include _position-offset;
      }`,
      description: "Is used as a mixin default parameter"
    },
    {
      code: `
      $_a-b: 1px;
      .b {
        margin: $-a-b;
      }`,
      description: "Is used as a mixin default parameter"
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
      message: messages.expected("-one"),
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
      message: messages.expected("-reset-list"),
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
      message: messages.expected("$-c"),
      line: 4,
      column: 7,
      description: "Variables used as function parameters"
    },
    {
      code: `
      $_a: 5px * 2;
      $_b: 900;
      
      .action-buttons {
        margin: 5px map.get($_a);
      }
      `,
      message: messages.expected("$-b"),
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
      message: messages.expected("$-a-color"),
      line: 3,
      column: 7,
      description: "Is in theme declaration"
    },
    {
      code: `
      $_a: false;
      $_b: true;

      .btn {
        @if ($_a) {
          margin: 0px;
        }
      }`,
      message: messages.expected("$-b"),
      line: 3,
      column: 7,
      description: "Is used in @if"
    },
    {
      code: `
      $_a: '&:hover';
      $_b: '&:not(:disabled):active';

      .@mixin states-selector() {
        #{$_a} {
          margin: 0px;
        }
      }`,
      message: messages.expected("$-b"),
      line: 3,
      column: 7,
      description: "Variable in interpolated selector."
    }
  ]
});
