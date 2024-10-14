"use strict";

const { messages, ruleName } = require("..");
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
        p {
          color: scale-color(blue, $alpha: -40%);
        }
      `,
      description: "accepts the scale-color function"
    },
    {
      code: `
        p {
          filter: saturate(50%);
        }
      `,
      description: "ignores a color function inside the filter property"
    },
    {
      code: `
        p {
          filter: drop-shadow(0 0 5px black) saturate(50%);
        }
      `,
      description:
        "ignores a color function inside the filter property when multiple values are used"
    }
  ],

  reject: [
    {
      code: `
        p {
          color: saturate(blue, 20%);
        }
      `,
      description: "does not accept the saturate function",
      message: messages.expected,
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 26
    },
    {
      code: `
        p {
          color: desaturate(blue, 20%);
        }
      `,
      description: "does not accept the desaturate function",
      message: messages.expected,
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 28
    },
    {
      code: `
        p {
          color: darken(blue, .2);
        }
      `,
      description: "does not accept the darken function",
      message: messages.expected,
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 24
    },
    {
      code: `
        p {
          color: lighten(blue, .2);
        }
      `,
      description: "does not accept the lighten function",
      message: messages.expected,
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 25
    },
    {
      code: `
        p {
          color: opacify(blue, .2);
        }
      `,
      description: "does not accept the opacify function",
      message: messages.expected,
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 25
    },
    {
      code: `
        p {
          color: fade-in(blue, .2);
        }
      `,
      description: "does not accept the fade-in function",
      message: messages.expected,
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 25
    },
    {
      code: `
        p {
          color: transparentize(blue, .2);
        }
      `,
      description: "does not accept the transparentize function",
      message: messages.expected,
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 32
    },
    {
      code: `
        p {
          color: fade-out(blue, .2);
        }
      `,
      description: "does not accept the fade-out function",
      message: messages.expected,
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 26
    },
    {
      code: `
        p {
          filter: drop-shadow(0 0 5px saturate(red, 50%));
        }
      `,
      description:
        "does not accept color functions inside a drop-shadow filter",
      message: messages.expected,
      line: 3,
      column: 39,
      endLine: 3,
      endColumn: 47
    },
    {
      code: `
        p {
          filter: contrast(175%) drop-shadow(0 0 5px saturate(red, 50%));
        }
      `,
      description:
        "does not accept color functions inside a drop-shadow filter when multiple filters are used",
      message: messages.expected,
      line: 3,
      column: 54,
      endLine: 3,
      endColumn: 62
    },
    {
      code: `
        p {
          filter: saturate(50%) drop-shadow(0 0 5px saturate(red, 50%));
        }
      `,
      description:
        "does not accept color functions inside a drop-shadow filter when multiple filters are used",
      message: messages.expected,
      line: 3,
      column: 53,
      endLine: 3,
      endColumn: 61
    },
    {
      code: `
        p {
          filter: drop-shadow(0 0 5px saturate(red, 50%)) saturate(50%);
        }
      `,
      description:
        "does not accept color functions inside a drop-shadow filter when multiple filters are used",
      message: messages.expected,
      line: 3,
      column: 39,
      endLine: 3,
      endColumn: 47
    }
  ]
});
