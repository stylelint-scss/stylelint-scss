import rule, { units } from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  accept: loopOverUnits({
    code: `
    p {
      padding: 1 * 1%unit%;
    }
    `,
    description: "Accepts proper value interpolation with %unit%"
  }).concat([
    {
      code: "$pad: 2; $doublePad: px#{$pad}px;",
      description: "does not report when a unit is preceded by another string"
    },
    {
      code: "$pad: 2; $doublePad: #{$pad}pxx;",
      description: "does not report lint when no understood units are used"
    },
    {
      code: `$pad: "2";
      $string: "#{$pad}px";`,
      description: "does not report lint when string is quoted"
    },
    {
      code: `
      @include media-breakpoint-up($grid-gutter-breakpoint) {
        --#{$variable-prefix}gutter-x: #{$gutter * 2};
      }`,
      description: "ignores interpolation without a unit"
    }
  ]),
  reject: loopOverUnits({
    code: `
      p {
        padding: #{$value}%unit%;
      }
      `,
    message: messages.rejected("%unit%"),
    line: 3,
    column: 18,
    endLine: 3,
    endColumn: 33,
    description: "Rejects interpolation with %unit%"
  }).concat([
    {
      code: "$pad: 2; $padAndMore: #{$pad + 5}px;",
      description: "reports lint when expression used in interpolation",
      line: 1,
      column: 23,
      endLine: 1,
      endColumn: 36,
      message: messages.rejected("px")
    },
    {
      code: `
      p {
        padding: ($foo * 1rem) #{$foo}px;
      }
      `,
      description: "reports lint when mixing accepted and rejected syntax",
      line: 3,
      column: 32,
      endLine: 3,
      endColumn: 41,
      message: messages.rejected("px")
    },
    {
      code: `
      p {
        padding: ($foo * 1rem) #{$foo}px 4vmin;
      }
      `,
      description: "reports lint when mixing accepted and rejected syntax",
      line: 3,
      column: 32,
      endLine: 3,
      endColumn: 41,
      message: messages.rejected("px")
    },
    {
      code: `
      p {
        padding: 1em #{$foo}vmin;
      }
      `,
      description: "reports lint when mixing normal unit and rejected syntax",
      line: 3,
      column: 22,
      endLine: 3,
      endColumn: 33,
      message: messages.rejected("vmin")
    },
    {
      code: `
      p {
        padding: 1em #{$foo}vmin 2rem;
      }
      `,
      description: "reports lint when mixing normal unit and rejected syntax",
      line: 3,
      column: 22,
      endLine: 3,
      endColumn: 33,
      message: messages.rejected("vmin")
    }
  ])
});

function loopOverUnits(codeBlock) {
  return units.map(unit => {
    const block = {
      code: codeBlock.code.replace(/%unit%/g, unit),
      description: codeBlock.description.replace(/%unit%/g, unit)
    };

    if (codeBlock.message) {
      block.message = codeBlock.message.replace(/%unit%/g, unit);
    }

    if (codeBlock.line) {
      block.line = codeBlock.line;
    }

    if (codeBlock.column) {
      block.column = codeBlock.column;
    }

    return block;
  });
}
