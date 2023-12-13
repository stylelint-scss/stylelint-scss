"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @mixin font-size-default {
        font-size: 16px;
      }
    `,
      description: "A single mixin."
    },
    {
      code: `
      @mixin font-size-default {
        font-size: 16px;
      }
      @mixin font-size-lg {
        font-size: 18px;
      }
    `,
      description: "Two mixins with different names."
    }
  ],

  reject: [
    {
      code: `
      @mixin font-size-default {
        font-size: 16px;
      }
      @mixin font-size-default {
        font-size: 18px;
      }
    `,
      line: 5,
      column: 14,
      endLine: 5,
      endColumn: 31,
      message: messages.rejected("font-size-default"),
      description: "Two mixins with the same names."
    },
    {
      code: `
      @mixin font-size-default {
        font-size: 16px;
      }
      @mixin font-size-sm {
        font-size: 14px;
      }
      @mixin font-size-default {
        font-size: 18px;
      }
    `,
      line: 8,
      column: 14,
      endLine: 8,
      endColumn: 31,
      message: messages.rejected("font-size-default"),
      description: "Three mixins including two with the same names."
    },
    {
      code: `
      @mixin font-size {
        font-size: 16px;
      }
      @mixin font-size($var) {
        font-size: $var;
      }
    `,
      line: 5,
      column: 14,
      endLine: 5,
      endColumn: 23,
      message: messages.rejected("font-size"),
      description:
        "Two mixins with the same names including one accepting arguments."
    },
    {
      code: `
      @mixin font-size($property, $value) {
        #{$property}: $value;
      }
      @mixin font-size($var) {
        font-size: $var;
      }
    `,
      line: 5,
      column: 14,
      endLine: 5,
      endColumn: 23,
      message: messages.rejected("font-size"),
      description: "Two mixins with the same names accepting arguments."
    },
    {
      code: `
      @mixin font-size {
        color: blue;
      }

      .b {
        @mixin font-size {
          color: red;
        }
        @include font-size;
      }
    `,
      line: 7,
      column: 16,
      endLine: 7,
      endColumn: 25,
      message: messages.rejected("font-size"),
      description: "Two mixins with the same names accepting arguments."
    }
  ]
});
