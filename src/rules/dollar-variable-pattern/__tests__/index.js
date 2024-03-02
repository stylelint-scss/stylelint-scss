"use strict";

const { messages, ruleName } = require("..");

// Testing against a ragex, sequence part
testRule({
  ruleName,
  config: [/foo/],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      p {
        $foo: 10px;
      }
    `,
      description: "Regexp: sequence part. Example: full match."
    },
    {
      code: `
      p {
        $_foo: 10px;
      }
    `,
      description: "Regexp: sequence part. Example: matches at the end."
    },
    {
      code: `
      p {
        $food: 10px;
      }
    `,
      description: "Regexp: sequence part. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: `
      p {
        $floo: 10px;
      }
    `,
      line: 3,
      column: 9,
      endLine: 3,
      endColumn: 14,
      message: messages.expected,
      description: "Regexp: sequence part. Example: symbol in between."
    }
  ]
});

// Testing against a string, sequence part
testRule({
  ruleName,
  config: ["foo"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      p {
        $foo: 10px;
      }
    `,
      description: "String: sequence part. Example: full match."
    },
    {
      code: `
      p {
        $_foo: 10px;
      }
    `,
      description: "String: sequence part. Example: matches at the end."
    },
    {
      code: `
      p {
        $food: 10px;
      }
    `,
      description: "String: sequence part. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: `
      p {
        $floo: 10px;
      }
    `,
      line: 3,
      message: messages.expected,
      description: "String: sequence part. Example: symbol in between."
    },
    {
      code: `
      p {
        $fo: 10px;
      }
    `,
      line: 3,
      message: messages.expected,
      description: "String: sequence part. Example: not a full sequence."
    }
  ]
});

// Testing against a regex, full match
testRule({
  ruleName,
  config: [/^foo$/],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      p {
        $foo: 10px;
      }
    `,
      description: "Regexp: strict pattern. Example: matches."
    }
  ],

  reject: [
    {
      code: `
      p {
        $_foo: 10px;
      }
    `,
      line: 3,
      message: messages.expected,
      description: "Regexp: strict pattern. Example: matches at the end."
    },
    {
      code: `
      p {
        $food: 10px;
      }
    `,
      line: 3,
      message: messages.expected,
      description: "Regexp: strict pattern. Example: matches at the beginning."
    },
    {
      code: `
      p {
        $floo: 10px;
      }
    `,
      line: 3,
      message: messages.expected,
      description: "Regexp: strict pattern. Example: symbol in between."
    }
  ]
});

// Testing against a regex, match at the beginning
testRule({
  ruleName,
  config: [/^foo/],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      p {
        $foo: 10px;
      }
    `,
      description: "Regexp: pattern at the beginning. Example: matches."
    },
    {
      code: `
      p {
        $food: 10px;
      }
    `,
      description:
        "Regexp: pattern at the beginning. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: `
      p {
        $_foo: 10px;
      }
    `,
      line: 3,
      message: messages.expected,
      description:
        "Regexp: pattern at the beginning. Example: matches at the end."
    },
    {
      code: `
      p {
        $floo: 10px;
      }
    `,
      line: 3,
      message: messages.expected,
      description:
        "Regexp: pattern at the beginning. Example: symbol in between."
    }
  ]
});

// Testing against a regex, SUIT naming
testRule({
  ruleName,
  config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "a { $Foo-bar: 0; }",
      description: "Regexp: SUIT component. Example: comply"
    },
    {
      code: "a { $Foo-barBaz: 0; }",
      description: "Regexp: SUIT component. Example: comply"
    }
  ],

  reject: [
    {
      code: "a { $boo-Foo-bar: 0; }",
      line: 1,
      message: messages.expected,
      description:
        "Regexp: SUIT component. Example: starts with lowercase, two elements"
    },
    {
      code: "a { $foo-bar: 0; }",
      line: 1,
      message: messages.expected,
      description: "Regexp: SUIT component. Example: starts with lowercase"
    },
    {
      code: "a { $Foo-Bar: 0; }",
      line: 1,
      message: messages.expected,
      description:
        "Regexp: SUIT component. Example: element starts with uppercase"
    }
  ]
});

// "ignore" options
testRule({
  ruleName,
  config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, { ignore: "local" }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "a { $oo-bar: 0; }",
      description: "Ignore local variable (not matching the pattern)."
    },
    {
      code: "a { font-size: myFontSize($oo-bar: 4px); }",
      description:
        "Ignore local variable (function call argument, not matching the pattern)."
    },
    {
      code: `a { font-size: myFontSize($oo-bar...); }`,
      description:
        "Ignore local variable (function call with arbitrary arguments, not matching the pattern)"
    },
    {
      code: "a { @include myFontSize($oo-bar: 4px); }",
      description:
        "Ignore local variable (include call with keyword argument, not matching the pattern)."
    },
    {
      code: "$Foo-barBaz: 0;",
      description:
        "Ignore local variable (passing global, matching the pattern)."
    },
    {
      code: `
      @mixin myFontSize($oo-bar) {
        font-size: $oo-bar;
      }
      `,
      description:
        "Ignore local variable (mixin argument, not matching the pattern)"
    },
    {
      code: `
      @mixin myFontSize($oo-bar...) {
        font-size: $oo-bar;
      }
      `,
      description:
        "Ignore local variable (mixin arbitrary arguments, not matching the pattern)"
    },
    {
      code: `
      @function myFontSize($oo-bar) {
        font-size: $oo-bar;
      }
      `,
      description:
        "Ignore local variable (function argument, not matching the pattern)"
    },
    {
      code: `
      @function myFontSize($oo-bar...) {
        font-size: $oo-bar;
      }
      `,
      description:
        "Ignore local variable (function arbitrary arguments, not matching the pattern)"
    }
  ],

  reject: [
    {
      code: "$boo-Foo-bar: 0;",
      line: 1,
      endLine: 1,
      endColumn: 13,
      message: messages.expected,
      description:
        "Ignore local variable (passing global, not matching the pattern)."
    },
    {
      code: `font-size: myFontSize($oo-bar: 4px);`,
      description:
        "Ignore local variable (function call with keyword argument, global, not matching the pattern)",
      message: messages.expected,
      line: 1,
      column: 23,
      endLine: 1,
      endColumn: 30
    },
    {
      code: `font-size: myFontSize($oo-bar...);`,
      description:
        "Ignore local variable (function call with arbitrary arguments, global, not matching the pattern)",
      message: messages.expected,
      line: 1,
      column: 23,
      endLine: 1,
      endColumn: 33
    },
    {
      code: `@include myFontSize($oo-bar: 4px);`,
      description:
        "Ignore local variable (include call with keyword argument, global, not matching the pattern)",
      message: messages.expected,
      line: 1,
      column: 21,
      endLine: 1,
      endColumn: 28
    }
  ]
});

testRule({
  ruleName,
  config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, { ignore: "global" }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "$oo-bar: 0;",
      description: "Ignore global variable (not matching the pattern)."
    },
    {
      code: "a { $Foo-barBaz: 0; }",
      description:
        "Ignore global variable (passing local, matching the pattern)."
    },
    {
      code: `
      @mixin myFontSize($Foo-barBaz) {
        font-size: $Foo-barBaz;
      }
      `,
      description:
        "Ignore global variable (mixin with argument, local, matching the pattern)"
    },
    {
      code: `
      @function myFontSize($Foo-barBaz) {
        font-size: $Foo-barBaz;
      }
      `,
      description:
        "Ignore global variable (function with argument, local, matching the pattern)"
    },
    {
      code: `@include myFontSize($oo-bar: 4px);`,
      description:
        "Ignore global variable (include call with keyword argument, global, not matching the pattern)"
    },
    {
      code: `@include myFontSize($Foo-barBaz: 4px);`,
      description:
        "Ignore global variable (include call with keyword argument, global, matching the pattern)"
    },
    {
      code: `font-size: myFontSize($oo-bar: 4px);`,
      description:
        "Ignore global variable (function call with keyword argument, global, not matching the pattern)"
    },
    {
      code: `font-size: myFontSize($Foo-barBaz: 4px);`,
      description:
        "Ignore global variable (function call with keyword argument, global, matching the pattern)"
    }
  ],

  reject: [
    {
      code: "a { $boo-Foo-bar: 0; }",
      line: 1,
      message: messages.expected,
      description:
        "Ignore global variable (passing local, not matching the pattern)."
    },
    {
      code: `
      @mixin myFontSize($oo-bar) {
        font-size: $oo-bar;
      }
      `,
      description:
        "Ignore global variable (mixin with argument, not matching the pattern)",
      message: messages.expected,
      line: 2,
      column: 25,
      endLine: 2,
      endColumn: 32
    },
    {
      code: `
      @function myFontSize($oo-bar) {
        font-size: $oo-bar;
      }
      `,
      description:
        "Ignore global variable (function with argument, not matching the pattern)",
      message: messages.expected,
      line: 2,
      column: 28,
      endLine: 2,
      endColumn: 35
    },
    {
      code: `div { @include myFontSize($oo-bar: 4px) };`,
      description:
        "Ignore global variable (include call with keyword argument, local, not matching the pattern)",
      message: messages.expected,
      line: 1,
      column: 27,
      endLine: 1,
      endColumn: 34
    },
    {
      code: `div { font-size: myFontSize($oo-bar: 4px); }`,
      description:
        "Ignore global variable (function call with keyword argument, local, not matching the pattern)",
      message: messages.expected,
      line: 1,
      column: 29,
      endLine: 1,
      endColumn: 36
    },
    {
      code: `div { font-size: myFontSize($oo-bar...); }`,
      description:
        "Ignore global variable (function call with arbitrary arguments, local, not matching the pattern)",
      message: messages.expected,
      line: 1,
      column: 29,
      endLine: 1,
      endColumn: 39
    }
  ]
});

testRule({
  ruleName,
  config: [/^[a-z]+([A-Z][a-z]+)+$/],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `$fontSize: 1;`,
      description: "Sass variable (valid pattern)"
    },
    {
      code: `
      @mixin myFontSize($fontSize) {
        font-size: $fontSize;
      }
      `,
      description: "mixin with argument (valid pattern)"
    },
    {
      code: `
      @mixin myFontSize($fontSize: 1) {
        font-size: $fontSize;
      }
      `,
      description: "mixin with optional argument (valid pattern)"
    },
    {
      code: `
      @mixin myFontSize($mySizes...) {}
      `,
      description: "mixin with arbitrary arguments (valid pattern)"
    },
    {
      code: `
      @mixin myFontSize($fontSize, $mySizes...) {}
      `,
      description:
        "mixin with arbitrary arguments as the second argument (valid pattern)"
    },
    {
      code: `
      @function myFontSize($fontSize) {
        font-size: $fontSize;
      }
      `,
      description: "function with argument (valid pattern)"
    },
    {
      code: `
      @function myFontSize($fontSize: 1) {
        font-size: $fontSize;
      }
      `,
      description: "function with optional argument (valid pattern)"
    },
    {
      code: `
      @function myFontSize($mySizes...) {}
      `,
      description: "function with arbitrary arguments (valid pattern)"
    },
    {
      code: `
        @include myFontSize($fontSize: 4px);
      `,
      description: "include call with keyword argument (valid pattern)"
    },
    {
      code: `div { font-size: myFontSize($fontSize: 4px); }`,
      description: "function call with keyword argument (valid pattern)"
    },
    {
      code: `div { font-size: myFontSize($mySizes...); }`,
      description: "function call with arbitrary arguments (valid pattern)"
    }
  ],

  reject: [
    {
      code: `$font-size: 1;`,
      description: "Sass variable (invalid pattern)",
      message: messages.expected,
      line: 1,
      column: 1,
      endLine: 1,
      endColumn: 11
    },
    {
      code: `
      @mixin my-font-size($font-size) {
        font-size: $font-size;
      }
      `,
      description: "mixin with argument (invalid pattern)",
      message: messages.expected,
      line: 2,
      column: 27,
      endLine: 2,
      endColumn: 37
    },
    {
      code: `
      @mixin my-font-size($font-size: 1) {
        font-size: $font-size;
      }
      `,
      description: "mixin with optional argument (invalid pattern)",
      message: messages.expected,
      line: 2,
      column: 27,
      endLine: 2,
      endColumn: 37
    },
    {
      code: `
      @mixin myFontSize($my-sizes...) {}
      `,
      description: "mixin with arbitrary arguments (invalid pattern)",
      message: messages.expected,
      line: 2,
      column: 25,
      endLine: 2,
      endColumn: 37
    },
    {
      code: `
      @mixin myFontSize($font-size, $my-sizes...) {}
      `,
      description:
        "mixin with arbitrary arguments as the second argument (2 warnings, invalid pattern)",
      warnings: [
        {
          message: messages.expected,
          line: 2,
          column: 25,
          endLine: 2,
          endColumn: 35
        },
        {
          message: messages.expected,
          line: 2,
          column: 37,
          endLine: 2,
          endColumn: 49
        }
      ]
    },
    {
      code: `
      @function my-font-size($font-size) {
        font-size: $font-size;
      }
      `,
      description: "function with argument (invalid pattern)",
      message: messages.expected,
      line: 2,
      column: 30,
      endLine: 2,
      endColumn: 40
    },
    {
      code: `
      @function my-font-size($font-size: 1) {
        font-size: $font-size;
      }
      `,
      description: "function with optional argument (invalid pattern)",
      message: messages.expected,
      line: 2,
      column: 30,
      endLine: 2,
      endColumn: 40
    },
    {
      code: `
      @function myFontSize($my-sizes...) {}
      `,
      description: "function with arbitrary arguments (invalid pattern)",
      message: messages.expected,
      line: 2,
      column: 28,
      endLine: 2,
      endColumn: 40
    },
    {
      code: `@include myFontSize($font-size: 4px);`,
      description: "include call with keyword argument (invalid pattern)",
      message: messages.expected,
      line: 1,
      column: 21,
      endLine: 1,
      endColumn: 31
    },
    {
      code: `div { font-size: myFontSize($font-size: 4px); }`,
      description: "function call with keyword argument (invalid pattern)",
      message: messages.expected,
      line: 1,
      column: 29,
      endLine: 1,
      endColumn: 39
    },
    {
      code: `div { font-size: myFontSize($my-sizes...); }`,
      description: "function call with arbitrary arguments (invalid pattern)",
      message: messages.expected,
      line: 1,
      column: 29,
      endLine: 1,
      endColumn: 41
    }
  ]
});
