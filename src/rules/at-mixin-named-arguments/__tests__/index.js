import rule, { ruleName, messages } from "..";

// Required ("always")
testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",

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
        @include reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      description: "Always. Example: all arguments are named."
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
      column: 9,
      message: messages.expected,
      description: "Always. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        @include reset(40px, 10px);
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Always. Example: first argument is not named."
    },
    {
      code: `
      .b {
        @include reset($duration);
      }
    `,
      line: 3,
      column: 9,
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
      column: 9,
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
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        @include reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Always. Example: mixed named arguments."
    },
    {
      code: `
      @include reset(40px);
    `,
      line: 2,
      column: 7,
      message: messages.expected,
      description:
        "Always. Example: single argument is not named in standalone mixin."
    },
    {
      code: `
      @include reset(40px, 10px);
    `,
      line: 2,
      column: 7,
      message: messages.expected,
      description:
        "Always. Example: first argument is not named in standalone mixin."
    }
  ]
});

// Not allowed ("never")
testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",

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
      column: 9,
      message: messages.expected,
      description: "Never. Example: single argument is named."
    },
    {
      code: `
      .b {
        @include reset($value: $other-value);
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Never. Example: single argument is a variable."
    },
    {
      code: `
      .b {
        @include reset($value: #{$other-value});
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Never. Example: single argument is an interpolated value."
    },
    {
      code: `
      .b {
        @include animation($duration: 30 * 25ms);
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Never. Example: single argument is a calculated value."
    },
    {
      code: `
      .b {
        @include reset($color: 'black');
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Never. Example: single argument is a quoted string."
    },
    {
      code: `
      .b {
        @include animation($iteration: infinite);
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Never. Example: single argument is an unquoted string."
    },
    {
      code: `
      @include reset($value: 40px);
      `,
      line: 2,
      column: 7,
      message: messages.expected,
      description: "Never. Example: standalone mixin."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Never. Example: all arguments are named."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, 10px);
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
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
      column: 9,
      message: messages.expected,
      description: "Never. Example: mixed named arguments."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["always-multiple-arguments"],
  syntax: "scss",

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
    // {
    //   code: `
    //   .b {
    //     @include reset(
    //       40px;
    //     );
    //   }
    //   `,
    //   description: "Always. Example: single argument with spaces."
    // },
    {
      code: `
      .b {
        @include reset(40px);
      }
    `,
      description:
        "Always multiple arguments. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        @include reset($duration);
      }
    `,
      description:
        "Always multiple arguments. Example: single argument is a variable and is not named."
    },
    {
      code: `
      .b {
        @include reset(30 * 25ms);
      }
    `,
      description:
        "Always multiple arguments. Example: single argument is a calculated value and is not named."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      description:
        "Always multiple arguments. Example: all arguments are named."
    },
    {
      code: `
      @include reset(40px);
    `,
      description:
        "Always multiple arguments. Example: single argument is not named in standalone mixin."
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
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: single argument is named."
    },
    {
      code: `
      .b {
        @include reset($value: $other-value);
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: single named argument is a variable."
    },
    {
      code: `
      .b {
        @include reset($value: #{$other-value});
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: single named argument is an interpolated value."
    },
    {
      code: `
      .b {
        @include animation($duration: 30 * 25ms);
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: single named argument is a calculated value."
    },
    {
      code: `
      .b {
        @include reset($color: 'black');
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: single named argument is a quoted string."
    },
    {
      code: `
      .b {
        @include animation($iteration: infinite);
      }
      `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: single argument is an unquoted string."
    },
    {
      code: `
      @include reset($value: 40px);
      `,
      line: 2,
      column: 7,
      message: messages.expected,
      description: "Always multiple arguments. Example: standalone mixin."
    },
    {
      code: `
      @include reset(40px, 10px);
    `,
      line: 2,
      column: 7,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: first argument is not named in standalone mixin."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, 10px);
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        @include reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Always multiple arguments. Example: mixed named arguments."
    },
    {
      code: `
      .b {
        @include reset($value: 40px, 10px, 'black');
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        @include reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Always multiple arguments. Example: mixed named arguments."
    }
  ]
});
