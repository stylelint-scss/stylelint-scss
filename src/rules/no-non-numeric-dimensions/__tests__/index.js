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
  }),
  reject: loopOverUnits({
    code: `
      p {
        padding: #{value}%unit%;
      }
      `,
    messages: messages.rejected,
    description: "Rejects interpolation with %unit%"
  })
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
