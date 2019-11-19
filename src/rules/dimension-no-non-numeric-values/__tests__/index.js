"use strict";

const { rule, ruleName, messages, units } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",
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
    column: 27,
    description: "Rejects interpolation with %unit%"
  }).concat([
    {
      code: "$pad: 2; $padAndMore: #{$pad + 5}px;",
      description: "reports lint when expression used in interpolation",
      line: 1,
      column: 34,
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
      column: 39,
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
      column: 39,
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
      column: 29,
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
      column: 29,
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
