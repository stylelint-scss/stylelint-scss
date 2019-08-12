import rule, { ruleName, messages, units } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",
  accept: loopOverUnits({
    code: `
    p {
      padding: "1" * 1%unit%;
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
    }
  ]),
  reject: loopOverUnits({
    code: `
      p {
        padding: #{$value}%unit%;
      }
      `,
    messages: messages.rejected,
    description: "Rejects interpolation with %unit%"
  }).concat([
    {
      code: "$pad: 2; $padAndMore: #{$pad + 5}px;",
      description: "reports lint when expression used in interpolation",
      messages: messages.rejected("px")
    }
  ])
});

function loopOverUnits(codeBlock) {
  return units.map(unit => {
    const block = {
      code: codeBlock.code.replace("%unit%", unit),
      description: codeBlock.description.replace("%unit%", unit)
    };

    if (codeBlock.messages) {
      block["messages"] = codeBlock.messages.call(unit);
    }

    return block;
  });
}
