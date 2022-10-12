import { ruleName, messages } from "..";

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "a { color: hwb(240 100% 50%); }",
      description: "Normal CSS function",
    },
    {
      code: "a { color: hsl(240 100% 50%); }",
      description: "Function both in CSS and SCSS",
    },
    {
      code: "a { color: if(true, green, red); }",
      description: "SCSS function",
    },
    {
      code: "a { color: adjust-color(#6b717f, $red: 15); }",
    },
    {
      code: "a { color: color.adjust(#6b717f, $red: 15); }",
    },
  ],

  reject: [
    {
      code: "a { color: unknown(1); }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 12,
    },
    {
      code: "a { color: color.unknown(#6b717f, $red: 15); }",
      message: messages.rejected("color.unknown"),
      line: 1,
      column: 12,
    },
  ],
});

testRule({
  ruleName,
  config: [true, { ignoreFunctions: ["/^my-/i", /foo$/, "bar"] }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "a { color: my-func(1); }",
    },
    {
      code: "a { color: MY-FUNC(1); }",
    },
    {
      code: "a { color: func-foo(1); }",
    },
    {
      code: "a { color: bar(1); }",
    },
  ],

  reject: [
    {
      code: "a { color: my(1); }",
      message: messages.rejected("my"),
      line: 1,
      column: 12,
    },
    {
      code: "a { color: foo-func(1); }",
      message: messages.rejected("foo-func"),
      line: 1,
      column: 12,
    },
    {
      code: "a { color: barrr(1); }",
      message: messages.rejected("barrr"),
      line: 1,
      column: 12,
    },
  ],
});
