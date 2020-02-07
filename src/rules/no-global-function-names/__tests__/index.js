import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
      a {
       background: rgb(27,224,63);
      }
    `,
      description: "An allowed global function"
    },
    {
      code: `
      a {
       background: rgba(27,224,63, 0);
      }
    `,
      description: "An allowed global function"
    },
    {
      code: `
      a {
       background: hsla(27,224,63, 0);
      }
    `,
      description: "An allowed global function"
    },
    {
      code: `
      a {
       background: hsa(27,224,63);
      }
    `,
      description: "An allowed global function"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.red(#6b717f);
      }
    `,
      description: "Red function"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.blue(#6b717f);
      }
    `,
      description: "Blue function"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.green(#6b717f);
      }
    `,
      description: "color.green function"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.mix(#6b717f, #6b717f);
      }
    `,
      description: "color.mix"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.hue(#6b717f);
      }
    `,
      description: "color.hue"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.saturation(#6b717f);
      }
    `,
      description: "color.saturation"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.lightness(#6b717f);
      }
    `,
      description: "color.lightness"
    },
    {
      code: `
      @use "sass:color";
      @debug color.alpha(#e1d7d2)`,
      description: "color.alpha"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.adjust(#6b717f, $red: 15);
      }
    `,
      description: "color.adjust (not adjust-color)"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.scale(#6b717f, $red: 15);
      }
    `,
      description: "color.scale (not scale-color)"
    },
    {
      code: `
      @use "sass:color";
      a {
       background: color.ie-hex-str(#6b717f);
      }
    `,
      description: "color.ie-hex-str"
    }
  ],

  reject: [
    {
      code: `
      a {
        background: red(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("red"),
      description: "red"
    },
    {
      code: `
      a {
        background: blue(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("blue"),
      description: "blue"
    },
    {
      code: `
      a {
        background: green(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("green"),
      description: "green"
    },
    {
      code: `
      a {
        background: mix(#6b717f, #6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("mix"),
      description: "mix"
    },
    {
      code: `
      a {
        background: hue(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("hue"),
      description: "hue"
    },
    {
      code: `
      a {
        background: saturation(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("saturation"),
      description: "saturation"
    },
    {
      code: `
      a {
        background: lightness(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("lightness"),
      description: "lightness"
    },
    {
      code: `
      a {
        background: alpha(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("alpha"),
      description: "alpha"
    },
    {
      code: `
      a {
        background: adjust-color(#6b717f, $red: 15);
      }
    `,
      line: 3,
      message: messages.rejected("adjust-color"),
      description: "adjust-color"
    },
    {
      code: `
      a {
        background: scale-color(#6b717f, $red: 15);
      }
    `,
      line: 3,
      message: messages.rejected("scale-color"),
      description: "scale-color"
    },
    {
      code: `
      a {
        background: change-color(#6b717f, $red: 15);
      }
    `,
      line: 3,
      message: messages.rejected("change-color"),
      description: "change-color"
    },
    {
      code: `
      a {
        background: ie-hex-str(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("ie-hex-str"),
      description: "ie-hex-str"
    }
  ]
});
