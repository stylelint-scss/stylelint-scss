import { ruleName, messages } from "..";

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      --border-width: 5px;
      $var: var(--border-width);

      .class {
        border-top: calc(#{$var} * 2) solid red;
      }
    `,
      description:
        "when variable is a string and it is interpolated in width when using it with calc() property"
    },
    {
      code: `
      --border-width: 5px;
      --border-width2: 6px;
      $var: var(--border-width);
      $var2: var(--border-width2);

      .class {
        border-top: calc(calc(#{$var} * 2) + #{$var2}) solid red;
      }
    `,
      description:
        "when variable is a string and it is interpolated in width when using it with calc() property"
    }
  ],

  reject: [
    {
      code: `
      --border-width: 5px;
      $var: var(--border-width);

      .class {
        border-top: calc($var * 2) solid red;
      }
    `,
      line: 6,
      message: messages.rejected("border-top", "$var"),
      description:
        "when variable is a string and it is not interpolated in border-top when using it with calc() property"
    },
    {
      code: `
      --border-width: 5px;
      --border-width2: 6px;
      $var: var(--border-width);
      $var2: var(--border-width2);

      .class {
        border-top: calc(calc($var * 2) + $var2) solid red;
      }
    `,
      line: 8,
      message: messages.rejected("border-top", "$var2"),
      description:
        "when variable is a string and it is not interpolated in border-top when using it with calc() property"
    }
  ]
});
