import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.channel(hsl(80deg 30% 50%), "opacity");
        }
      `,
      description: "accepts the color.channel function"
    },
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
          filter: opacity(50%);
        }
      `,
      description: "ignores a color function inside the filter property"
    },
    {
      code: `
        p {
          filter: drop-shadow(0 0 5px black) opacity(50%);
        }
      `,
      description:
        "ignores a color function inside the filter property when multiple values are used"
    }
  ],

  reject: [
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.alpha(#e1d7d2);
        }
      `,
      description: "does not accept the color.alpha function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 31
    },
    {
      code: `
        p {
          opacity: alpha(#e1d7d2);
        }
      `,
      description: "does not accept the alpha function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 25
    },
    {
      code: `
        p {
          opacity: opacity(#e1d7d2);
        }
      `,
      description: "does not accept the opacity function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 27
    },
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.blackness(#e1d7d2);
        }
      `,
      description: "does not accept the color.blackness function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 35
    },
    {
      code: `
        p {
          opacity: blackness(#e1d7d2);
        }
      `,
      description: "does not accept the blackness function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 29
    },
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.blue(#e1d7d2);
        }
      `,
      description: "does not accept the color.blue function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 30
    },
    {
      code: `
        p {
          opacity: blue(#e1d7d2);
        }
      `,
      description: "does not accept the blue function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 24
    },
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.green(#e1d7d2);
        }
      `,
      description: "does not accept the color.green function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 31
    },
    {
      code: `
        p {
          opacity: green(#e1d7d2);
        }
      `,
      description: "does not accept the green function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 25
    },
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.hue(#e1d7d2);
        }
      `,
      description: "does not accept the color.hue function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 29
    },
    {
      code: `
        p {
          opacity: hue(#e1d7d2);
        }
      `,
      description: "does not accept the hue function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 23
    },
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.lightness(#e1d7d2);
        }
      `,
      description: "does not accept the color.lightness function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 35
    },
    {
      code: `
        p {
          opacity: lightness(#e1d7d2);
        }
      `,
      description: "does not accept the lightness function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 29
    },
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.red(#e1d7d2);
        }
      `,
      description: "does not accept the color.red function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 29
    },
    {
      code: `
        p {
          opacity: red(#e1d7d2);
        }
      `,
      description: "does not accept the red function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 23
    },
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.saturation(#e1d7d2);
        }
      `,
      description: "does not accept the color.saturation function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 36
    },
    {
      code: `
        p {
          opacity: saturation(#e1d7d2);
        }
      `,
      description: "does not accept the saturation function",
      message: messages.expected,
      line: 3,
      column: 20,
      endLine: 3,
      endColumn: 30
    },
    {
      code: `
        @use 'sass:color';
        p {
          opacity: color.whiteness(#e1d7d2);
        }
      `,
      description: "does not accept the color.whiteness function",
      message: messages.expected,
      line: 4,
      column: 20,
      endLine: 4,
      endColumn: 35
    }
  ]
});
