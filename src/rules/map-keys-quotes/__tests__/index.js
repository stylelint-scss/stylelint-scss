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
    },
    {
      code: `
      $map: (
        "a": 1px,
        "b": 1px solid red,
      );
      `,
      description: "accepts a multi-word value after the first entry"
    },
    {
      code: `
      $map: (
        "b": 1px solid red,
      );
      `,
      description: "accepts a multi-word value in the first entry"
    },
    {
      code: `
      $map: (
        "a": (
          "b": 1px,
          "c": 0 0 $x $y $z,
        ),
      );
      `,
      description: "accepts a multi-word value in a nested map"
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
    },
    {
      code: `
        $test: ("a": 1px solid red, b: 2px)
      `,
      warnings: [
        {
          line: 2,
          column: 37,
          endLine: 2,
          endColumn: 38,
          message: messages.expected
        }
      ],
      description: "rejects an unquoted key after a multi-word value"
    },
    {
      code: `
        $test: ("a": $x * 2, b: 1)
      `,
      warnings: [
        {
          line: 2,
          column: 30,
          endLine: 2,
          endColumn: 31,
          message: messages.expected
        }
      ],
      description: "rejects an unquoted key after an operator in a value"
    },
    {
      code: `
        $test: ("a": 1/2, b: 1)
      `,
      warnings: [
        {
          line: 2,
          column: 27,
          endLine: 2,
          endColumn: 28,
          message: messages.expected
        }
      ],
      description: "rejects an unquoted key after a division in a value"
    },
    {
      code: `
        $test: ("a": 1, b c: 2)
      `,
      warnings: [
        {
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 26,
          message: messages.expected
        }
      ],
      description: "rejects an unquoted space-separated key"
    }
  ]
});
