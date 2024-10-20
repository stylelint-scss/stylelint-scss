import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

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
      description: "accepts strings with quotes"
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
    },
    {
      code: `
      $map: (
        "key-one": 0,
        "key-two": $variable * 2,
      );
      `,
      description: "accepts * operator inside a value"
    },
    {
      code: `
      $map: (
        "key-one": 0,
        "key-two": $variable*2,
      );
      `,
      description: "accepts * operator without spaces inside a value"
    },
    {
      code: `
      $map: (
        "key-one": 0,
        "key-two": $variable - 2,
      );
      `,
      description: "accepts - operator inside a value"
    },
    {
      code: `
      $map: (
        "key-one": 0,
        "key-two": $variable + 2,
      );
      `,
      description: "accepts + operator inside a value"
    },
    {
      code: `
      $map: (
        "key-one": 0,
        "key-two": $variable / 2,
      );
      `,
      description: "accepts / operator inside a value"
    },
    {
      code: `
      $map: (
        "key-one": 0,
        "key-two": $variable % 2,
      );
      `,
      description: "accepts % operator inside a value"
    },
    {
      code: `
      $map: (
        "key-one": 0,
        "key-two": (1+2),
      );
      `,
      description: "accepts parens inside a value"
    }
  ],

  reject: [
    {
      code: `
        $test: (Helvetica: 25px, Arial: 50px)
      `,
      warnings: [
        {
          line: 2,
          column: 17,
          endLine: 2,
          endColumn: 26,
          message: messages.expected
        },
        {
          line: 2,
          column: 34,
          endLine: 2,
          endColumn: 39,
          message: messages.expected
        }
      ],
      description:
        "does not accept variables representing strings that are quoted."
    }
  ]
});
