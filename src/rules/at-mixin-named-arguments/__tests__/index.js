import rule from "../index.js";

const { ruleName, messages } = rule;

// Required ("always")
testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        @include reset;
      }
      `,
      description: "Always. Example: no arguments."
    },
    {
      code: `
      .b {
        @include reset();
      }
      `,
      description: "Always. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        @include reset($value: 40px);
      }
      `,
      description: "Always. Example: single argument is named."
    },
    {
      code: `
      .b {
        @include reset(
          $value: 40px
        );
      }
      `,
      description:
        "Always. Example: single argument is named in multiline mixin call."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      description: "Always. Example: all arguments are named."
    },
    {
      code: `
      .b {
        @include reset(
          $value: 40px,
          $second-value: 10px,
          $color: 'black'
        );
      }
      `,
      description:
        "Always. Example: all arguments are named in multiline mixin call."
    },
    {
      code: `
      .b {
        @include reset($value: $other-value);
      }
      `,
      description: "Always. Example: single argument is a variable."
    },
    {
      code: `
      .b {
        @include reset($value: #{$other-value});
      }
      `,
      description: "Always. Example: single argument is an interpolated value."
    },
    {
      code: `
      .b {
        @include animation($duration: 30 * 25ms);
      }
      `,
      description: "Always. Example: single argument is a calculated value."
    },
    {
      code: `
      .b {
        @include animation($iteration: infinite);
      }
      `,
      description: "Always. Example: single argument is an unquoted string."
    },
    {
      code: `
      @include reset($value: 40px);
      `,
      description: "Always. Example: standalone mixin."
    }
  ],

  reject: [
    {
      code: `
      .b {
        @include reset(40px);
      }
    `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 28,
      message: messages.expected,
      description: "Always. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        @include reset(40px, 10px);
      }
    `,
      warnings: [
        {
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 28,
          message: messages.expected
        },
        {
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 34,
          message: messages.expected
        }
      ],
      description: "Always. Example: first argument is not named."
    },
    {
      code: `
      .b {
        @include reset(
          40px,
          10px
        );
      }
    `,
      warnings: [
        {
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 15,
          message: messages.expected
        },
        {
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 15,
          message: messages.expected
        }
      ],
      description:
        "Always. Example: first argument is not named in multiline mixin call."
    },
    {
      code: `
      .b {
        @include reset($duration);
      }
    `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 33,
      message: messages.expected,
      description:
        "Always. Example: single argument is a variable but is not named."
    },
    {
      code: `
      .b {
        @include reset(30 * 25ms);
      }
    `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 33,
      message: messages.expected,
      description:
        "Always. Example: single argument is a calculated value but is not named."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 42,
          message: messages.expected
        },
        {
          line: 3,
          column: 44,
          endLine: 3,
          endColumn: 51,
          message: messages.expected
        }
      ],
      description:
        "Always. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        @include reset(40px, $value: 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 28,
          message: messages.expected
        },
        {
          line: 3,
          column: 44,
          endLine: 3,
          endColumn: 51,
          message: messages.expected
        }
      ],
      description: "Always. Example: mixed named arguments."
    },
    {
      code: `
      @include reset(40px);
    `,
      line: 2,
      column: 22,
      endLine: 2,
      endColumn: 26,
      message: messages.expected,
      description:
        "Always. Example: single argument is not named in standalone mixin."
    },
    {
      code: `
      @include reset(40px, 10px);
    `,
      warnings: [
        {
          line: 2,
          column: 22,
          endLine: 2,
          endColumn: 26,
          message: messages.expected
        },
        {
          line: 2,
          column: 28,
          endLine: 2,
          endColumn: 32,
          message: messages.expected
        }
      ],
      description:
        "Always. Example: first argument is not named in standalone mixin."
    }
  ]
});

// Not allowed ("never")
testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        @include reset;
      }
      `,
      description: "Never. Example: no arguments."
    },
    {
      code: `
      .b {
        @include reset();
      }
      `,
      description: "Never. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        @include reset(40px);
      }
    `,
      description: "Never. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        @include reset(40px, 10px);
      }
    `,
      description: "Never. Example: multiple arguments that are not named."
    },
    {
      code: `
      .b {
        @include reset(
          40px,
          10px
        );
      }
    `,
      description:
        "Never. Example: multiple arguments that are not named in multiline mixin call."
    },
    {
      code: `
      .b {
        @include reset($duration);
      }
    `,
      description:
        "Never. Example: single argument is a variable and are not named."
    },
    {
      code: `
      .b {
        @include reset(30 * 25ms);
      }
    `,
      description:
        "Never. Example: single argument is a calculated value and not named."
    },
    {
      code: `
      .b {
        @include reset('black');
      }
    `,
      description:
        "Never. Example: single argument is a quoted string and not named."
    },
    {
      code: `
      .b {
        @include reset(black);
      }
    `,
      description:
        "Never. Example: single argument is an unquoted string and not named."
    },
    {
      code: `
      .b {
        @include reset(#{$value});
      }
    `,
      description:
        "Never. Example: single argument is an interpolated value and not named."
    },
    {
      code: `
      @include reset(40px);
    `,
      description:
        "Never. Example: single argument is not named in standalone mixin."
    },
    {
      code: `
      @include reset(40px, 10px);
    `,
      description:
        "Never. Example: all arguments are not named in standalone mixin."
    }
  ],

  reject: [
    {
      code: `
      .b {
        @include reset($value: 40px);
      }
      `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 36,
      message: messages.rejected,
      description: "Never. Example: single argument is named."
    },
    {
      code: `
      .b {
        @include reset($value: $other-value);
      }
      `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 44,
      message: messages.rejected,
      description: "Never. Example: single argument is a variable."
    },
    {
      code: `
      .b {
        @include reset($value: #{$other-value});
      }
      `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 47,
      message: messages.rejected,
      description: "Never. Example: single argument is an interpolated value."
    },
    {
      code: `
      .b {
        @include animation($duration: 30 * 25ms);
      }
      `,
      line: 3,
      column: 28,
      endLine: 3,
      endColumn: 48,
      message: messages.rejected,
      description: "Never. Example: single argument is a calculated value."
    },
    {
      code: `
      .b {
        @include reset($color: 'black');
      }
      `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 39,
      message: messages.rejected,
      description: "Never. Example: single argument is a quoted string."
    },
    {
      code: `
      .b {
        @include animation($iteration: infinite);
      }
      `,
      line: 3,
      column: 28,
      endLine: 3,
      endColumn: 48,
      message: messages.rejected,
      description: "Never. Example: single argument is an unquoted string."
    },
    {
      code: `
      @include reset($value: 40px);
      `,
      line: 2,
      column: 22,
      endLine: 2,
      endColumn: 34,
      message: messages.rejected,
      description: "Never. Example: standalone mixin."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      warnings: [
        {
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 36,
          message: messages.rejected
        },
        {
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 57,
          message: messages.rejected
        },
        {
          line: 3,
          column: 59,
          endLine: 3,
          endColumn: 74,
          message: messages.rejected
        }
      ],
      description: "Never. Example: all arguments are named."
    },
    {
      code: `
      .b {
        @include reset(
          $value: 40px,
          $second-value: 10px,
          $color: 'black'
        );
      }
      `,
      warnings: [
        {
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 23,
          message: messages.rejected
        },
        {
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 30,
          message: messages.rejected
        },
        {
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 26,
          message: messages.rejected
        }
      ],
      description:
        "Never. Example: all arguments are named in multiline mixin call."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, 10px);
      }
    `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 36,
      message: messages.rejected,
      description:
        "Never. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        @include reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 30,
      endLine: 3,
      endColumn: 42,
      message: messages.rejected,
      description: "Never. Example: mixed named arguments."
    }
  ]
});

testRule({
  ruleName,
  config: ["always", { ignore: ["single-argument"] }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        @include reset;
      }
      `,
      description: "Always and ignore single argument. Example: no arguments."
    },
    {
      code: `
      .b {
        @include reset();
      }
      `,
      description:
        "Always and ignore single argument. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        @include reset(40px);
      }
    `,
      description:
        "Always and ignore single argument. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        @include reset($duration);
      }
    `,
      description:
        "Always and ignore single argument. Example: single argument is a variable and is not named."
    },
    {
      code: `
      .b {
        @include reset(30 * 25ms);
      }
    `,
      description:
        "Always and ignore single argument. Example: single argument is a calculated value and is not named."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      description:
        "Always and ignore single argument. Example: all arguments are named."
    },
    {
      code: `
      .b {
        @include reset(
          $value: 40px,
          $second-value: 10px,
          $color: 'black'
        );
      }
      `,
      description:
        "Always and ignore single argument. Example: all arguments are named in multiline mixin call."
    },
    {
      code: `
      @include reset(40px);
    `,
      description:
        "Always and ignore single argument. Example: single argument is not named in standalone mixin."
    },
    {
      code: `
      .b {
        @include reset($value: $other-value);
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is a variable."
    },
    {
      code: `
      .b {
        @include reset($value: #{$other-value});
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is an interpolated value."
    },
    {
      code: `
      .b {
        @include animation($duration: 30 * 25ms);
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is a calculated value."
    },
    {
      code: `
      .b {
        @include reset($color: 'black');
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is a quoted string."
    },
    {
      code: `
      .b {
        @include animation($iteration: infinite);
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is an unquoted string."
    },
    {
      code: `
      @include reset($value: 40px);
      `,
      description:
        "Always and ignore single argument. Example: standalone mixin."
    }
  ],

  reject: [
    {
      code: `
      @include reset(40px, 10px);
    `,
      warnings: [
        {
          line: 2,
          column: 22,
          endLine: 2,
          endColumn: 26,
          message: messages.expected
        },
        {
          line: 2,
          column: 28,
          endLine: 2,
          endColumn: 32,
          message: messages.expected
        }
      ],
      description:
        "Always and ignore single argument. Example: first argument is not named in standalone mixin."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, 10px);
      }
    `,
      line: 3,
      column: 38,
      endLine: 3,
      endColumn: 42,
      message: messages.expected,
      description:
        "Always and ignore single argument. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        @include reset(
          $value: 40px,
          10px
        );
      }
    `,
      line: 5,
      column: 11,
      endLine: 5,
      endColumn: 15,
      message: messages.expected,
      description:
        "Always and ignore single argument. Example: first argument is named but remaining are not in multiline mixin call."
    },
    {
      code: `
      .b {
        @include reset(40px, $value: 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 28,
          message: messages.expected
        },
        {
          line: 3,
          column: 44,
          endLine: 3,
          endColumn: 51,
          message: messages.expected
        }
      ],
      description:
        "Always and ignore single argument. Example: mixed named arguments."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 42,
          message: messages.expected
        },
        {
          line: 3,
          column: 44,
          endLine: 3,
          endColumn: 51,
          message: messages.expected
        }
      ],
      description:
        "Always and ignore single argument. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        @include reset(40px, $value: 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 28,
          message: messages.expected
        },
        {
          line: 3,
          column: 44,
          endLine: 3,
          endColumn: 51,
          message: messages.expected
        }
      ],
      description:
        "Always and ignore single argument. Example: mixed named arguments."
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { ignore: "single-argument" }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        @include reset;
      }
      `,
      description: "Never and ignore single argument. Example: no arguments."
    },
    {
      code: `
      .b {
        @include reset();
      }
      `,
      description:
        "Never and ignore single argument. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        @include reset(40px);
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        @include reset(40px, 10px);
      }
    `,
      description:
        "Never and ignore single argument. Example: multiple arguments that are not named."
    },
    {
      code: `
      .b {
        @include reset(
          40px,
          10px
        );
      }
    `,
      description:
        "Never and ignore single argument. Example: multiple arguments that are not named in multiline mixin call."
    },
    {
      code: `
      .b {
        @include reset($duration);
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is a variable and are not named."
    },
    {
      code: `
      .b {
        @include reset(30 * 25ms);
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is a calculated value and not named."
    },
    {
      code: `
      .b {
        @include reset('black');
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is a quoted string and not named."
    },
    {
      code: `
      .b {
        @include reset(black);
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is an unquoted string and not named."
    },
    {
      code: `
      .b {
        @include reset(#{$value});
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is an interpolated value and not named."
    },
    {
      code: `
      @include reset(40px);
    `,
      description:
        "Never and ignore single argument. Example: single argument is not named in standalone mixin."
    },
    {
      code: `
      .b {
        @include reset($value: $other-value);
      }
      `,
      description:
        "Never and ignore single argument. Example: single named argument is a variable."
    },
    {
      code: `
      .b {
        @include reset($value: #{$other-value});
      }
      `,
      description:
        "Never and ignore single argument. Example: single named argument is an interpolated value."
    },
    {
      code: `
      .b {
        @include animation($duration: 30 * 25ms);
      }
      `,
      description:
        "Never and ignore single argument. Example: single named argument is a calculated value."
    },
    {
      code: `
      .b {
        @include reset($color: 'black');
      }
      `,
      description:
        "Never and ignore single argument. Example: single named argument is a quoted string."
    },
    {
      code: `
      .b {
        @include animation($iteration: infinite);
      }
      `,
      description:
        "Never and ignore single argument. Example: single named argument is an unquoted string."
    },
    {
      code: `
      @include reset($value: 40px);
      `,
      description:
        "Never and ignore single argument. Example: standalone mixin."
    },
    {
      code: `
      @include reset(40px, 10px);
    `,
      description:
        "Never and ignore single argument. Example: all arguments are not named in standalone mixin."
    }
  ],

  reject: [
    {
      code: `
      .b {
        @include reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      warnings: [
        {
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 36,
          message: messages.rejected
        },
        {
          line: 3,
          column: 38,
          endLine: 3,
          endColumn: 57,
          message: messages.rejected
        },
        {
          line: 3,
          column: 59,
          endLine: 3,
          endColumn: 74,
          message: messages.rejected
        }
      ],
      description:
        "Never and ignore single argument. Example: all arguments are named."
    },
    {
      code: `
      .b {
        @include reset(
          $value: 40px,
          $second-value: 10px,
          $color: 'black'
        );
      }
      `,
      warnings: [
        {
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 23,
          message: messages.rejected
        },
        {
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 30,
          message: messages.rejected
        },
        {
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 26,
          message: messages.rejected
        }
      ],
      description:
        "Never and ignore single argument. Example: all arguments are named in multiline mixin call."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, 10px);
      }
    `,
      line: 3,
      column: 24,
      endLine: 3,
      endColumn: 36,
      message: messages.rejected,
      description:
        "Never and ignore single argument. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        @include reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 30,
      endLine: 3,
      endColumn: 42,
      message: messages.rejected,
      description:
        "Never and ignore single argument. Example: mixed named arguments."
    }
  ]
});
