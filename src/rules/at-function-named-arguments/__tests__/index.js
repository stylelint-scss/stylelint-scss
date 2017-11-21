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
        border: reset;
      }
      `,
      description: "Always. Example: no arguments."
    },
    {
      code: `
      .b {
        border: reset();
      }
      `,
      description: "Always. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        border: reset($value: 40px);
      }
      `,
      description: "Always. Example: single argument is named."
    },
    {
      code: `
      .b {
        border: reset(
          $value: 40px
        );
      }
      `,
      description:
        "Always. Example: single argument is named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      description: "Always. Example: all arguments are named."
    },
    {
      code: `
      .b {
        border: reset(
          $value: 40px,
          $second-value: 10px,
          $color: 'black'
        );
      }
      `,
      description:
        "Always. Example: all arguments are named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($value: $other-value);
      }
      `,
      description: "Always. Example: single argument is a variable."
    },
    {
      code: `
      .b {
        border: reset($value: #{$other-value});
      }
      `,
      description: "Always. Example: single argument is an interpolated value."
    },
    {
      code: `
      .b {
        animation: anim($duration: 30 * 25ms);
      }
      `,
      description: "Always. Example: single argument is a calculated value."
    },
    {
      code: `
      .b {
        animation: anim($iteration: infinite);
      }
      `,
      description: "Always. Example: single argument is an unquoted string."
    }
  ],

  reject: [
    {
      code: `
      .b {
        border: reset(40px);
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
        border: reset(40px, 10px);
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
        border: reset(
          40px,
          10px
        );
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always. Example: first argument is not named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($duration);
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
        border: reset(30 * 25ms);
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
        border: reset($value: 40px, 10px, 'black');
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
        border: reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Always. Example: mixed named arguments."
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
        border: reset;
      }
      `,
      description: "Always. Example: no arguments."
    },
    {
      code: `
      .b {
        border: reset();
      }
      `,
      description: "Always. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        border: reset(40px);
      }
    `,
      description: "Never. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        border: reset(40px, 10px);
      }
    `,
      description: "Never. Example: multiple arguments that are not named."
    },
    {
      code: `
      .b {
        border: reset(
          40px,
          10px
        );
      }
    `,
      description:
        "Never. Example: multiple arguments that are not named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($duration);
      }
    `,
      description:
        "Never. Example: single argument is a variable and are not named."
    },
    {
      code: `
      .b {
        border: reset(30 * 25ms);
      }
    `,
      description:
        "Never. Example: single argument is a calculated value and not named."
    },
    {
      code: `
      .b {
        border: reset('black');
      }
    `,
      description:
        "Never. Example: single argument is a quoted string and not named."
    },
    {
      code: `
      .b {
        border: reset(black);
      }
    `,
      description:
        "Never. Example: single argument is an unquoted string and not named."
    },
    {
      code: `
      .b {
        border: reset(#{$value});
      }
    `,
      description:
        "Never. Example: single argument is an interpolated value and not named."
    }
  ],

  reject: [
    {
      code: `
      .b {
        border: reset($value: 40px);
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description: "Never. Example: single argument is named."
    },
    {
      code: `
      .b {
        border: reset($value: $other-value);
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description: "Never. Example: single argument is a variable."
    },
    {
      code: `
      .b {
        border: reset($value: #{$other-value});
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description: "Never. Example: single argument is an interpolated value."
    },
    {
      code: `
      .b {
        animation: anim($duration: 30 * 25ms);
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description: "Never. Example: single argument is a calculated value."
    },
    {
      code: `
      .b {
        border: reset($color: 'black');
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description: "Never. Example: single argument is a quoted string."
    },
    {
      code: `
      .b {
        animation: anim($iteration: infinite);
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description: "Never. Example: single argument is an unquoted string."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description: "Never. Example: all arguments are named."
    },
    {
      code: `
      .b {
        border: reset(
          $value: 40px,
          $second-value: 10px,
          $color: 'black'
        );
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description:
        "Never. Example: all arguments are named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, 10px);
      }
    `,
      line: 3,
      column: 9,
      message: messages.unexpected,
      description:
        "Never. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        border: reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 9,
      message: messages.unexpected,
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
        border: reset;
      }
      `,
      description: "Always. Example: no arguments."
    },
    {
      code: `
      .b {
        border: reset();
      }
      `,
      description: "Always. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        border: reset(40px);
      }
    `,
      description:
        "Always multiple arguments. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        border: reset($duration);
      }
    `,
      description:
        "Always multiple arguments. Example: single argument is a variable and is not named."
    },
    {
      code: `
      .b {
        border: reset(30 * 25ms);
      }
    `,
      description:
        "Always multiple arguments. Example: single argument is a calculated value and is not named."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      description:
        "Always multiple arguments. Example: all arguments are named."
    },
    {
      code: `
      .b {
        border: reset(
          $value: 40px,
          $second-value: 10px,
          $color: 'black'
        );
      }
      `,
      description:
        "Always multiple arguments. Example: all arguments are named in multiline function call."
    }
  ],

  reject: [
    {
      code: `
      .b {
        border: reset($value: 40px);
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpectedSingle,
      description:
        "Always multiple arguments. Example: single argument is named."
    },
    {
      code: `
      .b {
        border: reset($value: $other-value);
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpectedSingle,
      description:
        "Always multiple arguments. Example: single named argument is a variable."
    },
    {
      code: `
      .b {
        border: reset($value: #{$other-value});
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpectedSingle,
      description:
        "Always multiple arguments. Example: single named argument is an interpolated value."
    },
    {
      code: `
      .b {
        animation: anim($duration: 30 * 25ms);
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpectedSingle,
      description:
        "Always multiple arguments. Example: single named argument is a calculated value."
    },
    {
      code: `
      .b {
        border: reset($color: 'black');
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpectedSingle,
      description:
        "Always multiple arguments. Example: single named argument is a quoted string."
    },
    {
      code: `
      .b {
        animation: anim($iteration: infinite);
      }
      `,
      line: 3,
      column: 9,
      message: messages.unexpectedSingle,
      description:
        "Always multiple arguments. Example: single argument is an unquoted string."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, 10px);
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
        border: reset(
          $value: 40px,
          10px
        );
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description:
        "Always multiple arguments. Example: first argument is named but remaining are not in multiline function call."
    },
    {
      code: `
      .b {
        border: reset(40px, $value: 10px, 'black');
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
        border: reset($value: 40px, 10px, 'black');
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
        border: reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 9,
      message: messages.expected,
      description: "Always multiple arguments. Example: mixed named arguments."
    }
  ]
});
