import { messages, ruleName } from "..";

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
      description: "accepts the scalar-color function",
    },
    {
      code: `
        p {
          filter: saturate(50%);
        }
      `,
      description: "ignores a color function inside the filter property",
    },
    {
      code: `
        p {
          filter: drop-shadow(0 0 5px black) saturate(50%);
        }
      `,
      description:
        "ignores a color function inside the filter property when multiple values are used",
    },
  ],

  reject: [
    {
      code: `
        p {
          color: saturate(blue, 20%);
        }
      `,
      description: "does not accept the saturate function",
      message: messages.rejected,
      line: 3,
      column: 18,
    },
    {
      code: `
        p {
          color: desaturate(blue, 20%);
        }
      `,
      description: "does not accept the desaturate function",
      message: messages.rejected,
      line: 3,
      column: 18,
    },
    {
      code: `
        p {
          color: darken(blue, .2);
        }
      `,
      description: "does not accept the darken function",
      message: messages.rejected,
      line: 3,
      column: 18,
    },
    {
      code: `
        p {
          color: lighten(blue, .2);
        }
      `,
      description: "does not accept the lighten function",
      message: messages.rejected,
      line: 3,
      column: 18,
    },
    {
      code: `
        p {
          color: opacify(blue, .2);
        }
      `,
      description: "does not accept the opacify function",
      message: messages.rejected,
      line: 3,
      column: 18,
    },
    {
      code: `
        p {
          color: fade-in(blue, .2);
        }
      `,
      description: "does not accept the fade-in function",
      message: messages.rejected,
      line: 3,
      column: 18,
    },
    {
      code: `
        p {
          color: transparentize(blue, .2);
        }
      `,
      description: "does not accept the transparentize function",
      message: messages.rejected,
      line: 3,
      column: 18,
    },
    {
      code: `
        p {
          color: fade-out(blue, .2);
        }
      `,
      description: "does not accept the fade-out function",
      message: messages.rejected,
      line: 3,
      column: 18,
    },
    {
      code: `
        p {
          filter: drop-shadow(0 0 5px saturate(red, 50%));
        }
      `,
      description:
        "does not accept color functions inside a drop-shadow filter",
      message: messages.rejected,
      line: 3,
      column: 39,
    },
    {
      code: `
        p {
          filter: contrast(175%) drop-shadow(0 0 5px saturate(red, 50%));
        }
      `,
      description:
        "does not accept color functions inside a drop-shadow filter when multiple filters are used",
      message: messages.rejected,
      line: 3,
      column: 54,
    },
    {
      code: `
        p {
          filter: saturate(50%) drop-shadow(0 0 5px saturate(red, 50%));
        }
      `,
      description:
        "does not accept color functions inside a drop-shadow filter when multiple filters are used",
      message: messages.rejected,
      line: 3,
      column: 53,
    },
    {
      code: `
        p {
          filter: drop-shadow(0 0 5px saturate(red, 50%)) saturate(50%);
        }
      `,
      description:
        "does not accept color functions inside a drop-shadow filter when multiple filters are used",
      message: messages.rejected,
      line: 3,
      column: 39,
    },
  ],
});
