"use strict";

const { ruleName, messages } = require("..");

// Required ("always")
testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
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
        border: reset();
        text-align: center;
      }
      `,
      description: "Always. Example: no arguments with other declarations."
    },
    {
      code: `
      .b {
        background-image: linear-gradient(0deg, blue, green 40%, red);
      }
      `,
      description: "Always. Example: native CSS function is ignored."
    },
    {
      code: `
      .c {
        background-image: test($value: url("data:image/svg+xml;charset=utf8,%3C"));
      }
      `,
      description:
        "Always. Example: native CSS function is ignored inside a function call."
    },
    {
      code: `
      .b {
        transform: translateX(40px) translatey(10px);
      }
      `,
      description:
        "Always. Example: native CSS camel-casing function is ignored."
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
        border: reset(
          $value: 40px,
        );
      }
      `,
      description: "Always. Example: trailing comma after last argument."
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
    },
    {
      code: `
      .b {
        font-size: calc(10px * 2em);
      }
      `,
      description: "Always. Example: single argument is an unquoted string."
    },
    {
      code: `
      $space-values: (
        tiny: $horizontal-list-spacing-tiny,
        small: $horizontal-list-spacing-small,
        medium: $horizontal-list-spacing-medium,
        large: $horizontal-list-spacing-large,
        huge: $horizontal-list-spacing-huge
      );
      `,
      description: "Always. Should ignore Sass maps."
    },
    {
      code: `
      $space-values:   (
        tiny: $horizontal-list-spacing-tiny,
        small: $horizontal-list-spacing-small,
        medium: $horizontal-list-spacing-medium,
        large: $horizontal-list-spacing-large,
        huge: $horizontal-list-spacing-huge
      ) !default;
      `,
      description: "Always. Should ignore Sass maps with default."
    },
    {
      code: `
      $color: #123456;

      $rgb: (
        "r": red($red: $color),
        "g": green($green: $color),
        "b": blue($blue: $color)
      );
      `,
      description: "Always. function call inside a map."
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
      column: 23,
      endLine: 3,
      endColumn: 27,
      message: messages.expected,
      description: "Always. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        border: reset(40px, 10px);
      }
    `,
      warnings: [
        {
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 27,
          message: messages.expected
        },
        {
          line: 3,
          column: 29,
          endLine: 3,
          endColumn: 33,
          message: messages.expected
        }
      ],
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
        "Always. Example: first argument is not named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($duration);
      }
    `,
      line: 3,
      column: 23,
      endLine: 3,
      endColumn: 32,
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
      column: 23,
      endLine: 3,
      endColumn: 32,
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
      warnings: [
        {
          line: 3,
          column: 37,
          endLine: 3,
          endColumn: 41,
          message: messages.expected
        },
        {
          line: 3,
          column: 43,
          endLine: 3,
          endColumn: 50,
          message: messages.expected
        }
      ],
      description:
        "Always. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        border: reset(40px, $value: 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 27,
          message: messages.expected
        },
        {
          line: 3,
          column: 43,
          endLine: 3,
          endColumn: 50,
          message: messages.expected
        }
      ],
      description: "Always. Example: mixed named arguments."
    },
    {
      code: `
      .c {
        background-image: test(url("data:image/svg+xml;charset=utf8,%3C"));
      }
      `,
      line: 3,
      column: 32,
      endLine: 3,
      endColumn: 74,
      message: messages.expected,
      description:
        "Always. Example: native CSS function inside a function call."
    },
    {
      code: `
      $color: #123456;

      $rgb: (
        "r": red($color),
        "g": green($color),
        "b": blue($color)
      );
      `,
      warnings: [
        {
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 24,
          message: messages.expected
        },
        {
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 26,
          message: messages.expected
        },
        {
          line: 7,
          column: 19,
          endLine: 7,
          endColumn: 25,
          message: messages.expected
        }
      ],
      description: "Always. function call inside a map."
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
        background-image: linear-gradient(0deg, blue, green 40%, red);
      }
      `,
      description: "Never. Example: native CSS function is ignored."
    },
    {
      code: `
      .b {
        transform: translateX(40px) translatey(10px);
      }
      `,
      description:
        "Never. Example: native CSS camel-casing function is ignored."
    },
    {
      code: `
      .b {
        border: reset();
      }
      `,
      description: "Never. Example: no arguments with parenthesis."
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
    },
    {
      code: `
      .c {
        background-image: test(url("data:image/svg+xml;charset=utf8,%3C"));
      }
      `,
      description:
        "Never. Example: native CSS function is ignored inside a function call."
    },
    {
      code: `
      $color: #123456;

      $rgb: (
        "r": red($color),
        "g": green($color),
        "b": blue($color)
      );
      `,
      description: "Never. function call inside a map."
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
      column: 23,
      endLine: 3,
      endColumn: 35,
      message: messages.rejected,
      description: "Never. Example: single argument is named."
    },
    {
      code: `
      .b {
        border: reset($value: $other-value);
      }
      `,
      line: 3,
      column: 23,
      endLine: 3,
      endColumn: 43,
      message: messages.rejected,
      description: "Never. Example: single argument is a variable."
    },
    {
      code: `
      .b {
        border: reset($value: #{$other-value});
      }
      `,
      line: 3,
      column: 23,
      endLine: 3,
      endColumn: 46,
      message: messages.rejected,
      description: "Never. Example: single argument is an interpolated value."
    },
    {
      code: `
      .b {
        animation: anim($duration: 30 * 25ms);
      }
      `,
      line: 3,
      column: 25,
      endLine: 3,
      endColumn: 45,
      message: messages.rejected,
      description: "Never. Example: single argument is a calculated value."
    },
    {
      code: `
      .b {
        border: reset($color: 'black');
      }
      `,
      line: 3,
      column: 23,
      endLine: 3,
      endColumn: 38,
      message: messages.rejected,
      description: "Never. Example: single argument is a quoted string."
    },
    {
      code: `
      .b {
        animation: anim($iteration: infinite);
      }
      `,
      line: 3,
      column: 25,
      endLine: 3,
      endColumn: 45,
      message: messages.rejected,
      description: "Never. Example: single argument is an unquoted string."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      warnings: [
        {
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 35,
          message: messages.rejected
        },
        {
          line: 3,
          column: 37,
          endLine: 3,
          endColumn: 56,
          message: messages.rejected
        },
        {
          line: 3,
          column: 58,
          endLine: 3,
          endColumn: 73,
          message: messages.rejected
        }
      ],
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
        "Never. Example: all arguments are named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, 10px);
      }
    `,
      line: 3,
      column: 23,
      endLine: 3,
      endColumn: 35,
      message: messages.rejected,
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
      column: 29,
      endLine: 3,
      endColumn: 41,
      message: messages.rejected,
      description: "Never. Example: mixed named arguments."
    },
    {
      code: `
      .c {
        background-image: test($value: url("data:image/svg+xml;charset=utf8,%3C"));
      }
      `,
      line: 3,
      column: 32,
      endLine: 3,
      endColumn: 82,
      message: messages.rejected,
      description: "Never. Example: native CSS function inside a function call."
    },
    {
      code: `
      $color: #123456;

      $rgb: (
        "r": red($red: $color),
        "g": green($green: $color),
        "b": blue($green: $color)
      );
      `,
      warnings: [
        {
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 30,
          message: messages.rejected
        },
        {
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 34,
          message: messages.rejected
        },
        {
          line: 7,
          column: 19,
          endLine: 7,
          endColumn: 33,
          message: messages.rejected
        }
      ],
      description: "Never. function call inside a map."
    }
  ]
});

testRule({
  ruleName,
  config: ["always", { ignore: "single-argument" }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        background-image: linear-gradient(0deg, blue, green 40%, red);
      }
      `,
      description:
        "Always and ignore single argument. Example: native CSS function is ignored."
    },
    {
      code: `
      .b {
        transform: translateX(40px) translatey(10px);
      }
      `,
      description:
        "Always and ignore single argument. Example: native CSS camel-casing function is ignored."
    },
    {
      code: `
      .b {
        border: reset();
      }
      `,
      description:
        "Always and ignore single argument. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        border: reset(40px);
      }
    `,
      description:
        "Always and ignore single argument. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        border: reset($duration);
      }
    `,
      description:
        "Always and ignore single argument. Example: single argument is a variable and is not named."
    },
    {
      code: `
      .b {
        border: reset(30 * 25ms);
      }
    `,
      description:
        "Always and ignore single argument. Example: single argument is a calculated value and is not named."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      description:
        "Always and ignore single argument. Example: all arguments are named."
    },
    {
      code: `
      .b {
        border: reset($value: 40px);
      }
      `,
      description:
        "Always and ignore single argument. Example: single argument is named."
    },
    {
      code: `
      .b {
        border: reset($value: $other-value);
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is a variable."
    },
    {
      code: `
      .b {
        border: reset($value: #{$other-value});
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is an interpolated value."
    },
    {
      code: `
      .b {
        animation: anim($duration: 30 * 25ms);
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is a calculated value."
    },
    {
      code: `
      .b {
        border: reset($color: 'black');
      }
      `,
      description:
        "Always and ignore single argument. Example: single named argument is a quoted string."
    },
    {
      code: `
      .b {
        animation: anim($iteration: infinite);
      }
      `,
      description:
        "Always and ignore single argument. Example: single argument is an unquoted string."
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
        "Always and ignore single argument. Example: all arguments are named in multiline function call."
    }
  ],

  reject: [
    {
      code: `
      .b {
        border: reset(
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
        "Always and ignore single argument. Example: first argument is named but remaining are not in multiline function call."
    },
    {
      code: `
      .b {
        border: reset(40px, $value: 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 27,
          message: messages.expected
        },
        {
          line: 3,
          column: 43,
          endLine: 3,
          endColumn: 50,
          message: messages.expected
        }
      ],
      description:
        "Always and ignore single argument. Example: mixed named arguments."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 37,
          endLine: 3,
          endColumn: 41,
          message: messages.expected
        },
        {
          line: 3,
          column: 43,
          endLine: 3,
          endColumn: 50,
          message: messages.expected
        }
      ],
      description:
        "Always and ignore single argument. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        border: reset(40px, $value: 10px, 'black');
      }
    `,
      warnings: [
        {
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 27,
          message: messages.expected
        },
        {
          line: 3,
          column: 43,
          endLine: 3,
          endColumn: 50,
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
  config: ["never", { ignore: ["single-argument"] }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        background-image: linear-gradient(0deg, blue, green 40%, red);
      }
      `,
      description:
        "Never and ignore single argument. Example: native CSS function is ignored."
    },
    {
      code: `
      .b {
        transform: translateX(40px) translatey(10px);
      }
      `,
      description:
        "Never and ignore single argument. Example: native CSS camel-casing function is ignored."
    },
    {
      code: `
      .b {
        border: reset();
      }
      `,
      description:
        "Never and ignore single argument. Example: no arguments with parenthesis."
    },
    {
      code: `
      .b {
        border: reset(40px);
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        border: reset(40px, 10px);
      }
    `,
      description:
        "Never and ignore single argument. Example: multiple arguments that are not named."
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
        "Never and ignore single argument. Example: multiple arguments that are not named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($duration);
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is a variable and are not named."
    },
    {
      code: `
      .b {
        border: reset(30 * 25ms);
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is a calculated value and not named."
    },
    {
      code: `
      .b {
        border: reset('black');
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is a quoted string and not named."
    },
    {
      code: `
      .b {
        border: reset(black);
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is an unquoted string and not named."
    },
    {
      code: `
      .b {
        border: reset(#{$value});
      }
    `,
      description:
        "Never and ignore single argument. Example: single argument is an interpolated value and not named."
    },
    {
      code: `
      .b {
        border: reset($value: 40px);
      }
      `,
      description:
        "Never and ignore single argument. Example: single argument is named."
    },
    {
      code: `
      .b {
        border: reset($value: $other-value);
      }
      `,
      description:
        "Never and ignore single argument. Example: single argument is a variable."
    },
    {
      code: `
      .b {
        border: reset($value: #{$other-value});
      }
      `,
      description:
        "Never and ignore single argument. Example: single argument is an interpolated value."
    },
    {
      code: `
      .b {
        animation: anim($duration: 30 * 25ms);
      }
      `,
      description:
        "Never and ignore single argument. Example: single argument is a calculated value."
    },
    {
      code: `
      .b {
        border: reset($color: 'black');
      }
      `,
      description:
        "Never and ignore single argument. Example: single argument is a quoted string."
    },
    {
      code: `
      .b {
        animation: anim($iteration: infinite);
      }
      `,
      description:
        "Never and ignore single argument. Example: single argument is an unquoted string."
    }
  ],

  reject: [
    {
      code: `
      .b {
        border: reset($value: 40px, $second-value: 10px, $color: 'black');
      }
      `,
      warnings: [
        {
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 35,
          message: messages.rejected
        },
        {
          line: 3,
          column: 37,
          endLine: 3,
          endColumn: 56,
          message: messages.rejected
        },
        {
          line: 3,
          column: 58,
          endLine: 3,
          endColumn: 73,
          message: messages.rejected
        }
      ],
      description:
        "Never and ignore single argument. Example: all arguments are named."
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
        "Never and ignore single argument. Example: all arguments are named in multiline function call."
    },
    {
      code: `
      .b {
        border: reset($value: 40px, 10px);
      }
    `,
      line: 3,
      column: 23,
      endLine: 3,
      endColumn: 35,
      message: messages.rejected,
      description:
        "Never and ignore single argument. Example: first argument is named but remaining are not."
    },
    {
      code: `
      .b {
        border: reset(40px, $value: 10px, 'black');
      }
    `,
      line: 3,
      column: 29,
      endLine: 3,
      endColumn: 41,
      message: messages.rejected,
      description:
        "Never and ignore single argument. Example: mixed named arguments."
    }
  ]
});

testRule({
  ruleName,
  config: ["always", { ignoreFunctions: ["map-get", "/^my-/i", "/funct$/"] }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        border: reset($value: 40px);
      }
      `,
      description:
        "Always and ignore function. Example: single argument is named."
    },
    {
      code: `
      .b {
        content: map-get($map, key);
      }
      `,
      description: "Always and ignore function: ignored function."
    },
    {
      code: `
      .b {
        content: my-func($map, key);
      }
      `,
      description: "Always and ignore function: ignored function."
    },
    {
      code: `
      .b {
        content: MY-FUNC($map, key);
      }
      `,
      description: "Always and ignore function: ignored function."
    },
    {
      code: `
      .b {
        content: ffunct($map, key);
      }
      `,
      description: "Always and ignore function: ignored function."
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
      column: 23,
      endLine: 3,
      endColumn: 27,
      message: messages.expected,
      description:
        "Always and ignore function. Example: single argument that is not named."
    },
    {
      code: `
      .b {
        content: FFUNCT($map, key);
      }
    `,
      warnings: [
        {
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 29,
          message: messages.expected
        },
        {
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 34,
          message: messages.expected
        }
      ],
      description:
        "Always and ignore function. Example: function name's case does not match regex."
    },
    {
      code: `
      .b {
        content: fmap-get($map, key);
      }
    `,
      warnings: [
        {
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 31,
          message: messages.expected
        },
        {
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 36,
          message: messages.expected
        }
      ],
      description:
        "Always and ignore function. Example: function name does not match string or regex."
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { ignoreFunctions: ["somefunc", "/^my-/", "/funct$/"] }],
  customSyntax: "postcss-scss",

  accept: [
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
        content: somefunc($key: 1, $key2: 2);
      }
      `,
      description: "Never and ignore function: ignored function."
    },
    {
      code: `
      .b {
        content: my-func($key: 1, $key2: 2);
      }
      `,
      description: "Never and ignore function: ignored function."
    },
    {
      code: `
      .b {
        content: ffunct($key: 1, $key2: 2);
      }
      `,
      description: "Never and ignore function: ignored function."
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
      column: 23,
      endLine: 3,
      endColumn: 35,
      message: messages.rejected,
      description: "Never. Example: single argument is named."
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { ignoreFunctions: ["scale-color"] }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        --my-var: scale-color(#fff, $lightness: -75%);
    }
    `,
      description: "Never. No interpolation, issue #451"
    },
    {
      code: `
      .b {
        --my-var: #{scale-color(#fff, $lightness: -75%)};
    }
    `,
      description: "Never. With interpolation, issue #451"
    }
  ],

  reject: [
    {
      code: `
      .b {
        --my-var: color(#fff, $lightness: -75%);
      }
      `,
      line: 3,
      column: 31,
      endLine: 3,
      endColumn: 47,
      message: messages.rejected,
      description: "Never. Function not ignored, issue #451"
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { ignoreFunctions: ["/^scale-color/"] }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .b {
        --my-var: scale-color(#fff, $lightness: -75%);
    }
    `,
      description: "Never. No interpolation, issue #451"
    },
    {
      code: `
      .b {
        --my-var: #{scale-color(#fff, $lightness: -75%)};
    }
    `,
      description: "Never. With interpolation, issue #451"
    }
  ],

  reject: [
    {
      code: `
      .b {
        --my-var: color(#fff, $lightness: -75%);
      }
      `,
      line: 3,
      column: 31,
      endLine: 3,
      endColumn: 47,
      message: messages.rejected,
      description: "Never. Function not ignored, issue #451"
    }
  ]
});
