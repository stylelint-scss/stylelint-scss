import rule, { ruleName, messages, units } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",
  accept: [
    {
      code: `
    p {
      padding: "1" * 1em;
    }
    `,
      description: "Accepts proper value interpolation with em"
    }
  ],
  reject: [
    {
      code: `
      p {
        padding: #{value}em;
      }
      `,
      messages: messages.rejected,
      description: "Rejects interpolation with em"
    }
  ],
  acceptBlah: loopOverUnits({
    code: `
    p {
      padding: "1" * 1%unit%;
    }
    `,
    description: "Accepts proper value interpolation with %unit%"
  }),
  rejectBlah: loopOverUnits({
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
  units.map(unit => {
    return {
      code: codeBlock.code.replace("%unit%", unit),
      description: codeBlock.description.replace("%unit%", unit),
      messages: codeBlock.messages
    };
  });
}
