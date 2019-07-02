import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",

  accept: [
    {
      code: `
        $test: ("foo": 14px, "bar": 25px);
      `,
      description: "accepts strings without quotes"
    }
  ],

  reject: [
    {
      code: `
        $test: (Helvetica: 25px, Arial: 50px)
      `,
      message: messages.expected,
      description:
        "does not accept variables representing strings that are quoted.",
      location: 1
    }
  ]
});
