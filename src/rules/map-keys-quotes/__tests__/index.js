import rule, { messages, ruleName } from "..";

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
    },
    {
      code: `
        $test: ('foo': 14px, 'bar': 25px);
      `,
      description: "accepts strings without quotes"
    },
    {
      code: `
      $colors: (
        250: #eef9ff,
        300: #bbe7ff,
        350: #b7d3e6,
        500: #1388db,
        750: #0f6bac,
        900: #2e4662
      );
      `,
      description: "accepts numbers"
    },
    {
      code: `
      $colors: (
        'primary': (
          250: #eef9ff,
          300: #bbe7ff,
          350: #b7d3e6,
          500: #1388db,
          750: #0f6bac,
          900: #2e4662,
        )
      );
      `,
      description: "accepts numbers (nested)"
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
