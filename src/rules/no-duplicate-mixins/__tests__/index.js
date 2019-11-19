"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

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
      column: 7,
      line: 5,
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
      column: 7,
      line: 8,
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
      column: 7,
      line: 5,
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
      column: 7,
      line: 5,
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
      column: 9,
      line: 7,
      message: messages.rejected("font-size"),
      description: "Two mixins with the same names accepting arguments."
    }
  ]
});
