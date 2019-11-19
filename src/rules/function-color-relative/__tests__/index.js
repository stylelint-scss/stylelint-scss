"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
        p {
          color: scale-color(blue, $alpha: -40%);
        }
      `,
      description: "accepts the scalar-color function"
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
      message: messages.rejected
    },
    {
      code: `
        p {
          color: desaturate(blue, 20%);
        }
      `,
      description: "does not accept the desaturate function",
      message: messages.rejected
    },
    {
      code: `
        p {
          color: darken(blue, .2);
        }
      `,
      description: "does not accept the darken function",
      message: messages.rejected
    },
    {
      code: `
        p {
          color: lighten(blue, .2);
        }
      `,
      description: "does not accept the lighten function",
      message: messages.rejected
    },
    {
      code: `
        p {
          color: opacify(blue, .2);
        }
      `,
      description: "does not accept the opacify function",
      message: messages.rejected
    },
    {
      code: `
        p {
          color: fade-in(blue, .2);
        }
      `,
      description: "does not accept the fade-in function",
      message: messages.rejected
    },
    {
      code: `
        p {
          color: transparentize(blue, .2);
        }
      `,
      description: "does not accept the transparentize function",
      message: messages.rejected
    },
    {
      code: `
        p {
          color: fade-out(blue, .2);
        }
      `,
      description: "does not accept the fade-out function",
      message: messages.rejected
    }
  ]
});
