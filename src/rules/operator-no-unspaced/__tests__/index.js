"use strict";

const { messages, ruleName } = require("..");

// ------------------------------------------------------------------------
// Testing +
// ------------------------------------------------------------------------

// +, before a number (with or without a unit)
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { width: 1 +1; }",
      description: "List. width: 1 +1."
    },
    {
      code: "a { width: s1- +1; }",
      description: "List. width: s1- +1."
    },
    {
      code: "a { width: abc- +1; }",
      description: "List. width: abc- +1."
    },
    {
      code: "a { width: 1px +1px; }",
      description: "List. width: 1px +1px."
    },
    {
      code: "a { width: 1px- +1px; }",
      description: "List. width: 1px- +1px."
    },
    {
      code: "a { width: #{$var} +1; }",
      description: "List. width: #{$var} +1."
    },
    {
      code: ":root { --foo: '{{}}'; }",
      description: "Custom property"
    },
    {
      code: `
      @mixin test {
        @for $i from 0 through 10 {
          &:nth-child(#{$i + 1}) {
            top: #{$i * -10}px;
            transform: scale(#{(10 - $i) * 0.1}) !important;
          }
        }
      }
      `,
      description: "issue #561"
    },
    {
      code: `
      @font-face {
        font-family: 'Ampersand';
        src: local('Times New Roman');
        unicode-range: U+26;
      }
      `,
      description: "unicode-range"
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(../../img/build/svg/arrow-#{$i + 2}-down-dark.svg);
      }
      `,
      description:
        "background-image with relative path inside url function and interpolation."
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i + 2}-down-dark.svg);
      }
      `,
      description:
        "Op +: background-image with absolute path inside url function and interpolation."
    },
    {
      code: `
      div { background-image: url(https://99-0a.x.y.rackcdn.com/z.jpg); }
      `,
      description: "Op +: background-image with url that has a hyphen"
    },
    {
      code: `div { background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+) }`,
      description: "background image with base64 data, issue #561"
    },
    {
      code: `
      .foo {
	      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="412" height="395" viewBox="0 0 412 395"><style>.bar{}</style><g fill-rule="evenodd"><path d="M208.805 393.054c45.057-161.12 43.75-161.848 76.32-276.73l7.832 4.523c4.255 2.458 7.738.448 7.738-4.455V61.606c8.643-30.27 15.416-53.66 17.4-60.693h35.287L412 55.217l-38.498 33.27 29.11 31.473-191.86 273.094c-.938 1.542-2.244 1.19-1.947 0zm20.96-347.278c1.733 0 3.148.958 3.148 2.147V76c0 1.186-1.415 2.15-3.147 2.15H182.37c-1.742 0-3.153-.96-3.153-2.15V47.923c0-1.185 1.41-2.147 3.153-2.147h47.396z"/><path d="m288.265 14.688-52.14 30.1c.605.92.973 1.98.973 3.136v28.078c0 1.457-.565 2.77-1.496 3.83l52.663 30.402c3.59 2.073 6.535.377 6.535-3.764V18.456c0-4.145-2.944-5.836-6.535-3.768zM175.03 76V47.923c0-1.15.368-2.21.966-3.13l-52.14-30.105c-3.588-2.068-6.53-.376-6.53 3.768v88.013c0 4.14 2.938 5.84 6.53 3.76l52.66-30.405c-.926-1.06-1.487-2.37-1.487-3.827z"/><path d="M201.248 393.054h1.947c-45.05-161.12-43.753-161.848-76.32-276.73l-7.833 4.523c-4.253 2.458-7.737.448-7.737-4.455V61.606C102.66 31.336 95.89 7.946 93.9.913H58.617L0 55.217l38.494 33.27-29.11 31.473 191.864 273.094z"/><circle cx="204.572" cy="122.538" r="14.231"/><circle cx="204.572" cy="207.156" r="14.231"/><circle cx="204.572" cy="291.785" r="14.23"/></g></svg>');
      }
      `,
      description: "background image with an svg, issue #605"
    },
    {
      code: `
       $accordion-button-active-icon: url("data:image/svg+xml;charset=utf-8,<svg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' x='0' y='0' viewBox='0 0 512 512' xml:space='preserve'><style>.st0{fill:#{$accordion-icon-color-active};stroke:%231d4dcd;stroke-width:32;stroke-linecap:round;stroke-linejoin:round}</style><path class='st0' d='M256 112v288M400 256H112'/></svg>") !default;
      `,
      description: "data uri inside a variable, issue #605"
    },
    {
      code: `
      div { background: #e6375d url(data:image/png;base64,iVBOR////+LBpLMAA); }
      `,
      description: "data uri in background shorthand, issue #961"
    }
  ],

  reject: [
    {
      // The - is an operator, the + is a sign
      code: `a {
      width: 1- +1;
    }`,
      description: "Op, -. width: 1- +1.",
      message: messages.expectedBefore("-"),
      line: 2,
      column: 15,
      endLine: 2,
      endColumn: 16
    },
    {
      code: "a { width: #{1 +1}; }",
      description: "Op (inside interpolation). width: 1 +1.",
      message: messages.expectedAfter("+"),
      line: 1,
      column: 16
    },
    {
      code: "a { width: (1px +1px); }",
      description: "Op, in braces. width: (1px +1px).",
      message: messages.expectedAfter("+"),
      line: 1,
      column: 17
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(../../img/build/svg/arrow-#{$i +2}-down-dark.svg);
      }
      `,
      description:
        "background-image with relative path inside url function and interpolation.",
      message: messages.expectedAfter("+"),
      line: 4,
      column: 62
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i +2}-down-dark.svg);
      }
      `,
      description:
        "Op +: background-image with relative path inside url function and interpolation.",
      message: messages.expectedAfter("+"),
      line: 4,
      column: 86
    }
  ]
});

// +, before an interpolation
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { b: 1 +#{$var}; }",
      description: "Op. b: 1 +#{$var}.",
      message: messages.expectedAfter("+"),
      column: 10
    },
    {
      code: "a { b1: 1- +#{$var}; }",
      description: "b1: 1- +#{$var}.",
      message: messages.expectedBefore("-"),
      column: 10
    },
    {
      code: "a { b2: 1px- +#{$var}; }",
      description: "b2: 1px- +#{$var}.",
      message: messages.expectedAfter("+"),
      column: 14
    },
    {
      code: "a { b3: ss- +#{$var}; }",
      description: "Op. b3: ss- +#{$var}.",
      message: messages.expectedAfter("+"),
      column: 13
    },
    {
      code: "a { b4: ss+ +#{1 + 2}; }",
      description: "Op (ss+). b4: ss+ +#{1 + 2}.",
      message: messages.expectedBefore("+"),
      column: 11
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i+ 2}-down-dark.svg);
      }
      `,
      description:
        "Op +: background-image with relative path inside url function and interpolation.",
      message: messages.expectedBefore("+"),
      line: 4,
      column: 85
    }
  ]
});

// +, before a variable
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { b: 1 +$var; }",
      description: "Op. b: 1 +$var.",
      message: messages.expectedAfter("+"),
      column: 10
    },
    {
      code: "a { b1: 1- +$var; }",
      description: "b1: 1- +$var.",
      message: messages.expectedBefore("-"),
      column: 10
    },
    {
      code: "a { b2: 1px- +$var; }",
      description: "b2: 1px- +$var.",
      message: messages.expectedAfter("+"),
      column: 14
    },
    {
      code: "a { b3: ss- +$var; }",
      description: "Op. b3: ss- +$var.",
      message: messages.expectedAfter("+"),
      column: 13
    }
  ]
});

// +, before a string
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { c4: +ss; }",
      description: "Symbol: +ss."
    }
  ],

  reject: [
    {
      code: "a { c: 1 +c; }",
      description: "Op. c: 1 +c.",
      message: messages.expectedAfter("+"),
      column: 10
    },
    {
      code: "a { c2: 1px- +C; }",
      description: "Op, + (not -). c2: 1px- +C.",
      message: messages.expectedAfter("+"),
      column: 14
    },
    {
      code: "a { c3: ss- +c; }",
      description: "Op, + (not -). c3: ss- +c.",
      message: messages.expectedAfter("+"),
      column: 13
    },
    {
      code: "a { c5: ss+ +c; }",
      description: "Op, the first +. c5: ss+ +c.",
      message: messages.expectedBefore("+"),
      column: 11
    },
    {
      code: "a { c5: 1px +s.1px; }",
      message: messages.expectedAfter("+"),
      description: "Op (1px + s). c5: 1px +s.1px."
    }
  ]
});

// +, before a color
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { d2: #{$var} +#ffc; }",
      message: messages.expectedAfter("+"),
      description: "Op (concatenates at least): #{$var} +#ffc."
    },
    {
      code: "a { d: 1 +#ffc; }",
      message: messages.expectedAfter("+"),
      description: "Op: 1 +#ffc."
    },
    {
      code: "a { d3: ss- +#ffc; }",
      description: "Op (+, not -): ss- +#ffc.",
      message: messages.expectedAfter("+"),
      column: 13
    }
  ]
});

// + after something
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { plusafter1: 1+ 1; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1+ 1."
    },
    {
      code: "a { plusafter11: 1+ 1px; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1+ 1px."
    },
    {
      code: "a { plusafter12: 1+ px; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1+ px."
    },
    {
      code: "a { plusafter13: 1+ #0ff; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1+ #0ff."
    },
    {
      code: "a { plusafter14: 1+ $var; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1+ $var."
    },
    {
      code: "a { plusafter14: 1+ fn(); }",
      message: messages.expectedBefore("+"),
      description: "Op: 1+ fn()."
    },
    {
      code: "a { plusafter2: 1px+ 1; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1px+ 1."
    },
    {
      code: "a { plusafter21: 1px+ 1px; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1px+ 1px."
    },
    {
      code: "a { plusafter22: 1px+ px; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1px+ px."
    },
    {
      code: "a { plusafter24: 1px+ $var; }",
      message: messages.expectedBefore("+"),
      description: "Op: 1px+ $var."
    },
    {
      code: "a { plusafter14: 1px+ fn(); }",
      message: messages.expectedBefore("+"),
      description: "Op: 1px+ fn()."
    },
    {
      code: "a { plusafter3: #0f0+ 1; }",
      message: messages.expectedBefore("+"),
      description: "Op: #0f0+ 1."
    },
    {
      code: "a { plusafter22: #0f0+ px; }",
      message: messages.expectedBefore("+"),
      description: "Op: #0f0+ px."
    },
    {
      code: "a { plusafter13: #0f0+ #0ff; }",
      message: messages.expectedBefore("+"),
      description: "Op: #0f0+ #0ff."
    },
    {
      code: "a { plusafter24: #0f0+ $var1; }",
      message: messages.expectedBefore("+"),
      description: "Op: #0f0+ $var1."
    },
    {
      // Interpolation here was making it a List prior to Sass 4. Now fixed
      code: "a { plusafter24: 1px+ #{1 + 2}; }",
      description: "Op (since Sass 4): 1px+ #{1 + 2}.",
      message: messages.expectedBefore("+"),
      column: 21
    },
    {
      code: "a { plusafter24: 1px+ #{$var}; }",
      description: "Op (since Sass 4): 1px+ #{$var}.",
      message: messages.expectedBefore("+"),
      column: 21
    },
    {
      code: "a { plusafter24: #0f0+ #{1 + 2}; }",
      description: "Op (since Sass 4): #0f0+ #{1 + 2}.",
      message: messages.expectedBefore("+"),
      column: 22
    },
    {
      code: "a { plusafter24: #0f0+ #{$var}; }",
      message: messages.expectedBefore("+"),
      description: "Op (since Sass 4): #0f0+ #{$var}."
    }
  ]
});

// ------------------------------------------------------------------------
// Testing -
// ------------------------------------------------------------------------

// - before a number/unit
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { a: 1 -1; }",
      description: "List: 1 -1."
    },
    {
      code: "a { a0: (1 -1); }",
      description: "List (even though parens): (1 -1)."
    },
    {
      code: "a { a11: s1- -1; }",
      description: "List: s1- -1."
    },
    {
      code: "a { a11: (s1- -1); }",
      description: "List: (s1- -1)."
    },
    {
      code: "a { a13: 1px -1; }",
      description: "List: 1px -1."
    },
    {
      code: "a { a2: 1px -1px; }",
      description: "List: 1px -1px."
    },
    {
      code: "a { a20: (1px -1px); }",
      description: "List: (1px -1px)."
    },
    {
      code: "a { a21: 1 -1px; }",
      description: "List: 1 -1px."
    },
    {
      code: "a { a210: (1 -1px); }",
      description: "List: (1 -1px)."
    },
    {
      code: "a { a3: 1px- -1px; }",
      description: "List: 1px- -1px."
    },
    {
      code: "a { a30: (1px- -1px); }",
      description: "List: (1px- -1px)."
    },
    {
      code: "a { a5: s.1px -1px; }",
      description:
        "List (actually, it gets calculated, but only if with the `s` appendix...): s.1px -1px."
    }
  ],

  reject: [
    {
      code: "a { a1: 1- -1; }",
      description: "Op (1-): 1- -1.",
      message: messages.expectedBefore("-"),
      column: 10
    },
    {
      code: "a { a11: 1+ -1; }",
      description: "Op (1+): 1+ -1.",
      message: messages.expectedBefore("+"),
      column: 11
    }
  ]
});

// - before an interpolation
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { b: 1 -#{$var}; }",
      description: "Sign: 1 -#{$var}."
    },
    {
      code: "a { b2: 1px- -#{$var}; }",
      description: "Sign: 1px- -#{$var}.",
      message: messages.expectedAfter("-"),
      column: 14
    },
    {
      code: "a { b3: ss- -#{$var}; }",
      description: "Sign: ss- -#{$var}."
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i - 2}-down-dark.svg);
      }
      `,
      description:
        "Op -: background-image with absolute path inside url function and interpolation."
    }
  ],

  reject: [
    {
      code: "a { b1: 1- -#{$var}; }",
      description: "op (1-): 1- -#{$var}.",
      message: messages.expectedBefore("-"),
      column: 10
    },
    {
      code: "a { b4: ss+ -#{1 + 2}; }",
      description: "Op (ss+): ss+ -#{1 + 2}.",
      message: messages.expectedBefore("+"),
      column: 11
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i- 2}-down-dark.svg);
      }
      `,
      description:
        "Op -: background-image with relative path inside url function and interpolation.",
      message: messages.expectedBefore("-"),
      line: 4,
      column: 85
    }
  ]
});

// - before a string
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { c: 1 -c; }",
      description: "Char: 1 -c."
    },
    {
      code: "a { c2: 1px- -C; }",
      description: "Char (both): 1px- -C."
    },
    {
      code: "a { c3: ss- -c; }",
      description: "Char (both): ss- -c."
    },
    {
      code: "a { c4: -ss; }",
      description: "Char: -ss."
    }
  ],

  reject: [
    {
      code: "a { c5: ss+ -c; }",
      description: "+ is an op, - is not: ss+ -c.",
      message: messages.expectedBefore("+"),
      column: 11
    },
    {
      code: "a { c1: 1- -c; }",
      description: "1- is op, -c is string: 1- -c.",
      message: messages.expectedBefore("-"),
      column: 10
    }
  ]
});

// - before a variable
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { b: 1 -$var; }",
      message: messages.expectedAfter("-"),
      description: "Op: 1 -$var."
    },
    {
      code: "a { b1: 1- -$var; }",
      description: "Op: 1- -$var.",
      message: messages.expectedBefore("-"),
      column: 10
    },
    {
      code: "a { b2: 1px -$var; }",
      description: "Op: 1px -$var.",
      message: messages.expectedAfter("-")
    },
    {
      code: "a { b21: 1px+ -$var; }",
      description: "Op: 1px+ -$var.",
      message: messages.expectedBefore("+"),
      column: 13
    },
    {
      code: "a { b3: ss- -$var; }",
      description: "Op: ss- -$var.",
      message: messages.expectedAfter("-"),
      column: 13
    },
    {
      code: "a { b4: $var+ -$var; }",
      description: "Op: $var+ -$var.",
      message: messages.expectedBefore("+"),
      column: 13
    },
    {
      // The plus gives one warning
      code: "a { b4: #{$var}+ -$var; }",
      description: "Op (the +): #{$var}+ -$var.",
      message: messages.expectedBefore("+"),
      column: 16
    },
    {
      // The plus gives one warning
      code: "a { b4: ss+ -$var; }",
      description: "Op (the +): ss+ -$var.",
      message: messages.expectedBefore("+"),
      column: 11
    }
  ]
});

// - before a HEX-color
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { d: 1 -#ffc; }",
      description: "Char (concatenation though): 1 -#ffc."
    },
    {
      code: "a { d3: ss- -#ffc; }",
      description: "Char (concatenation though): ss- -#ffc."
    }
  ],

  reject: [
    {
      code: "a { d4: ss+ -#ffc; }",
      description: "Char (and + is op): ss+ -#ffc.",
      message: messages.expectedBefore("+"),
      column: 11
    },
    {
      code: "a { d2: #ff4 -#ffc; }",
      message: messages.expectedAfter("-"),
      description: "Op: #ff4 -#ffc."
    },
    {
      code: "a { d1: 1- -#ffc; }",
      description: "concatenation: 1- -#ffc.",
      message: messages.expectedBefore("-"),
      column: 10
    }
  ]
});

// - after a number
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { minusafter1: 1- 1; }",
      message: messages.expectedBefore("-"),
      description: "Op: 1- 1."
    },
    {
      code: "a { minusafter11: 1- 1px; }",
      message: messages.expectedBefore("-"),
      description: "Op: 1- 1px."
    },
    {
      code: "a { minusafter110: (1- 1px); }",
      message: messages.expectedBefore("-"),
      description: "Op: (1- 1px)."
    },
    {
      code: "a { minusafter12: 1- px; }",
      message: messages.expectedBefore("-"),
      description: "Op (though concatenated): 1- px."
    },
    {
      code: "a { minusafter13: 1- #0ff; }",
      message: messages.expectedBefore("-"),
      description: "Op (though concatenated): 1- #0ff."
    },
    {
      code: "a { minusafter15: 1- $var; }",
      message: messages.expectedBefore("-"),
      description: "Op: 1- $var."
    },
    {
      code: "a { minusafter16: 1- fn(); }",
      message: messages.expectedBefore("-"),
      description: "Op: 1- fn()."
    },
    {
      code: "a { minusafter15: 1- #{$var}; }",
      message: messages.expectedBefore("-"),
      description: "Op (though concatenated): 1- #{$var}."
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i -2}-down-dark.svg);
      }
      `,
      description:
        "Op -: background-image with relative path inside url function and interpolation.",
      message: messages.expectedAfter("-"),
      line: 4,
      column: 86
    }
  ]
});

// - after a value with a unit
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { minusafter2: 1px- 1; }",
      description: "Sign: 1px- 1."
    },
    {
      code: "a { minusafter20: (1px- 1); }",
      description: "Sign: (1px- 1)."
    },
    {
      code: "a { minusafter21: 1px- 1px; }",
      description: "Sign: 1px- 1px."
    },
    {
      code: "a { minusafter211: 1px- +1px; }",
      description: "Sign: 1px- +1px."
    },
    {
      code: "a { minusafter22: 1px- px; }",
      description: "Sign: 1px- px."
    },
    {
      code: "a { minusafter24: 1px- $var; }",
      description: "Sign: 1px- $var."
    },
    {
      code: "a { minusafter14: 1px- fn(); }",
      description: "Sign: 1px- fn()."
    },
    {
      code: "a { minusafter24: 1px- #{1 + 2}; }",
      description: "Sign: 1px- #{1 + 2}."
    },
    {
      code: "a { minusafter24: 1px- #{$var}; }",
      description: "Sign: 1px- #{$var}."
    }
  ]
});

// - after a HEX color
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { minusafter3: #0f0- 1; }",
      message: messages.expectedBefore("-"),
      description: "Op: #0f0- 1."
    },
    {
      code: "a { minusafter22: #0f0- px; }",
      message: messages.expectedBefore("-"),
      description: "Op (concat): #0f0- px."
    },
    {
      code: "a { minusafter13: #0f0- #0ff; }",
      message: messages.expectedBefore("-"),
      description: "Op: #0f0- #0ff."
    },
    {
      code: "a { minusafter24: #0f0- $var1; }",
      message: messages.expectedBefore("-"),
      description: "Op: #0f0- $var1."
    },
    {
      code: "a { minusafter34: #0f0- #{1 + 2}; }",
      description: "Op (concat): #0f0- #{1 + 2}.",
      message: messages.expectedBefore("-"),
      column: 23
    }
  ]
});

// - without spaces
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { nospaces3: px-1px; }",
      description: "Char: px-1px."
    },
    {
      code: "a { nospaces2: 5px-px; }",
      description: "Char: 5px-px."
    },
    {
      code: "a { nospaces9: $var-1; }",
      description: "Char (actually, part of variable name): $var-1."
    },
    {
      code: "a { nospaces9: $var-1px; }",
      description: "Char (actually, part of variable name): $var-1px."
    },
    {
      code: "a { nospaces9: #{$var-1px}; }",
      description: "Char (actually, part of variable name): $var-1px."
    },
    {
      code: 'a { background-image: url(if($bootstrap-sass-asset-helper, twbs-image-path("#{$var-1x}"), "#{$var-1x}")); }',
      description:
        'Char (actually, part of variable name): url(if($bootstrap-sass-asset-helper, twbs-image-path("#{$var-1x}"), "#{$var-1x}"));.'
    },
    {
      code: "a { nospaces102: 1-fn(); }",
      description: "Char: 1-fn()."
    },
    {
      code: "a { nospaces71: #{1px}-1; }",
      description: "??: #{1px}-1."
    },
    {
      code: "a { nospaces72: #{1}-1; }",
      description: "??: #{1}-1."
    },
    {
      code: "a { nospaces73: 1-#{1}; }",
      description: "??: 1-#{1}."
    },
    {
      code: '@forward "src/list" as list-*;',
      description: "should ignore @forward"
    },
    {
      code: `
      $fooBar: #{color.scale(
        #000000,
        $lightness: -50%,
        $alpha: -50%
      )};
      `,
      description:
        "should ignore function call inside interpolation, issue #803"
    },
    {
      code: "$c: #{color.scale(#000000, $lightness: -50%, $alpha: -50%)};",
      description:
        "should ignore function call inside interpolation, issue #803"
    }
  ]
});

// - next to parens
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { width: 10px -(1 + 1)};",
      description: "10px -(1 + 1).",
      line: 1,
      column: 17,
      message: messages.expectedAfter("-")
    },
    {
      code: "a { width: (10px)- 1};",
      description: "(10px)- 1.",
      line: 1,
      column: 18,
      message: messages.expectedBefore("-")
    }
  ]
});

// Mixed cases
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a {transform: translate(-50%, -$no-ui-slider-height);}",
      description: "translate(-50%, -$no-ui-slider-height)."
    }
  ]
});

// ------------------------------------------------------------------------
// Testing /
// ------------------------------------------------------------------------

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { slash1: 1px/1px; }",
      description: "Char: 1px/1px."
    },
    {
      code: "a { slash12: $var/string; }",
      description: "CSS slash: $var/string."
    },
    {
      code: "a { slash12: string/$var }",
      description: "CSS slash: string/$var."
    },
    {
      code: "a { slash12: #{$var}/1; }",
      description: "Char: #{$var}/1."
    },
    {
      code: "a { slash11: 1px/ 1px; }",
      description: "Char: 1px/ 1px."
    },
    {
      code: "a { slash12: 1px /1px; }",
      description: "Char: 1px /1px."
    },
    {
      code: "a { width: 8px/2px +5px; }",
      description: "width: 8px/2px +5px."
    },
    {
      code: "a { width: 8px/2px +5; }",
      description: "width: 8px/2px +5."
    },
    {
      code: "a { width: 8px/2px -5px; }",
      description: "width: 8px/2px -5px."
    },
    {
      code: "a { width: 8px/2px -5; }",
      description: "width: 8px/2px -5."
    },
    {
      code: "a { width: 8px/2px -ss; }",
      description: "width: 8px/2px -ss."
    },
    {
      code: "a { width: 8px/2px -fn(); }",
      description: "width: 8px/2px -fn()."
    },
    {
      code: "a { width: (8px/2px -5px); }",
      description: "width: (8px/2px -5px)."
    },
    {
      code: "a { width: (8px/2px -5); }",
      description: "width: (8px/2px -5)."
    },
    {
      code: "a { width: 8px/2px-ss; }",
      description: "width: 8px/2px-ss."
    },
    {
      code: "a { width: 8px/2px-$var; }",
      description: "width: 8px/2px-$var."
    },
    {
      code: "a { width: 8px/2px-fn(); }",
      description: "width: 8px/2px-fn()."
    },
    {
      code: "a { width: 8px/2 -5px; }",
      description: "width: 8px/2 -5px."
    },
    {
      code: "a { width: 8px/2 -5; }",
      description: "width: 8px/2 -5."
    },
    {
      code: "a { width: 8px/2 -ss; }",
      description: "width: 8px/2 -ss."
    },
    {
      code: "a { width: 8px/2 -#{1}; }",
      description: "width: 8px/2 -#{1}."
    },
    {
      code: "a { width: 8px/2 -fn(); }",
      description: "width: 8px/2 -fn()."
    },
    {
      code: "a { width: (8px/2 -5px); }",
      description: "width: (8px/2 -5px)."
    },
    {
      code: "a { width: (8px/2 -5); }",
      description: "width: (8px/2 -5)."
    },
    {
      code: "a { width: 8px/2-ss; }",
      description: "width: 8px/2-ss."
    },
    {
      code: "a { width: 8px/2-#{$var}; }",
      description: "width: 8px/2-#{$var}."
    },
    {
      code: "a { width: 8px/2-fn(); }",
      description: "width: 8px/2-fn()."
    },
    {
      code: "a { width: 8px/2px- 5px; }",
      description: "width: 8px/2px- 5px."
    },
    {
      code: "a { width: 8px/2px- 5; }",
      description: "width: 8px/2px- 5."
    },
    {
      code: "a { width: 8px/2px- 5; }",
      description: "width: 8px/2px- 5."
    },
    {
      code: "a { width: 8px/2px- ss; }",
      description: "width: 8px/2px- ss."
    },
    {
      code: "a { width: 8px/2px- $var; }",
      description: "width: 8px/2px- $var."
    },
    {
      code: "a { width: 8px/2px- fn(); }",
      description: "width: 8px/2px- fn()."
    },
    {
      code: "a { width: (8px/2px- 5px); }",
      description: "width: (8px/2px- 5px)."
    },
    {
      code: "a { width: (8px/2px- 5); }",
      description: "width: (8px/2px- 5)."
    },
    {
      code: `
      .thing {
        background-image: url(../../img/build/svg/arrow-11-down-dark.svg);
      }
      `,
      description: "background image with relative path inside url function."
    },
    {
      code: `
      .thing {
        background-image: url(../../img/build/svg/arrow-11-down-dark.svg), url(../../img/build/svg/arrow-11-down-dark.svg);
      }
      `,
      description:
        "multiple background images with relative path inside url function."
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(../../img/build/svg/arrow-#{$i / 2}-down-dark.svg);
      }
      `,
      description:
        "background-image with relative path inside url function and interpolation."
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i / 2}-down-dark.svg);
      }
      `,
      description:
        "Op /: background-image with absolute path inside url function and interpolation."
    }
  ],

  reject: [
    {
      code: "a { slash10: (1px/ 1px); }",
      message: messages.expectedBefore("/"),
      description: "Op: (1px/ 1px)."
    },
    {
      code: "a { slash12: 1px /$var; }",
      message: messages.expectedAfter("/"),
      description: "Op: 1px /$var."
    },
    {
      code: "a { slash12: $var/ 1; }",
      description: "Op: $var/ 1.",
      message: messages.expectedBefore("/"),
      column: 18
    },
    {
      code: "a { slash12: $var /-1px; }",
      description: "Op: $var /-1px.",
      message: messages.expectedAfter("/"),
      column: 19
    },
    {
      code: "a { slash12: 2px/ fn(); }",
      description: "Op: 2px/ fn().",
      message: messages.expectedBefore("/"),
      column: 17
    },
    {
      code: "a { slash12: 2px /-fn(); }",
      description: "Op: 2px /-fn().",
      message: messages.expectedAfter("/"),
      column: 18
    },
    {
      code: "a { slash12: 2px /+fn(); }",
      description: "Op: 2px /+fn().",
      message: messages.expectedAfter("/"),
      column: 18
    },
    {
      code: "a { width: 8px/2- ss }",
      description:
        "- does concatenate, so warning. But it's not a math op, so doesn't /: 8px/2- ss.",
      message: messages.expectedBefore("-"),
      column: 17
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(../../img/build/svg/arrow-#{$i /2}-down-dark.svg);
      }
      `,
      description:
        "background-image with relative path inside url function and interpolation.",
      message: messages.expectedAfter("/"),
      line: 4,
      column: 62
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i /2}-down-dark.svg);
      }
      `,
      description:
        "Op /: background-image with relative path inside url function and interpolation.",
      message: messages.expectedAfter("/"),
      line: 4,
      column: 86
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i/ 2}-down-dark.svg);
      }
      `,
      description:
        "Op /: background-image with relative path inside url function and interpolation.",
      message: messages.expectedBefore("/"),
      line: 4,
      column: 85
    }
  ]
});

// - next to parens
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { width: (10px) /#{(1 + 1)}};",
      description:
        "Has parens, but also interpolation; ignored: (10px) /#{(1 + 1)}."
    },
    {
      code: "a { width: #{10} /(1.2)};",
      description: "Has parens, but also interpolation; ignored: #{10} /(1.2)."
    },
    {
      code: "a { width: (10px) /normal; };",
      description: "Has parens, but also a string; ignored: (10px) /normal."
    },
    {
      code: "a { width: inherit /(1.1); }",
      description: "Has parens, but also a string; ignored: inherit /(1.1)."
    }
  ],

  reject: [
    {
      code: "a { width: 10px /(1 + 1)};",
      description: "10px /(1 + 1).",
      line: 1,
      column: 17,
      message: messages.expectedAfter("/")
    },
    {
      code: "a { width: (10px)/ 1};",
      description: "(10px)/ 1.",
      line: 1,
      column: 18,
      message: messages.expectedBefore("/")
    }
  ]
});

// ------------------------------------------------------------------------
// Testing *
// ------------------------------------------------------------------------

// If the operand is not a number, still consider it an operation
// e.g. `width: 7*st;` makes Sass throw an error
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i * 2}-down-dark.svg);
      }
      `,
      description:
        "Op *: background-image with absolute path inside url function and interpolation."
    },
    {
      code: '@use "src/corners" as *;',
      description: "ignores @use"
    },
    {
      code: `
      .container {
        @at-root * {
          color: red;
        }
      }
      `,
      description: "ignores @at-root"
    },
    {
      code: `
      .element {
        @supports selector(:has(*)) {
          opacity: 0;
        }
      }
      `,
      description: "issue #709"
    }
  ],

  reject: [
    {
      code: "a { width: 10* 1; }",
      description: "Op: 10* 1.",
      message: messages.expectedBefore("*"),
      column: 14
    },
    {
      code: "a { width: 10 *1; }",
      description: "Op: 10 *1.",
      message: messages.expectedAfter("*"),
      column: 15
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i *2}-down-dark.svg);
      }
      `,
      description:
        "Op *: background-image with relative path inside url function and interpolation.",
      message: messages.expectedAfter("*"),
      line: 4,
      column: 86
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i* 2}-down-dark.svg);
      }
      `,
      description:
        "Op *: background-image with relative path inside url function and interpolation.",
      message: messages.expectedBefore("*"),
      line: 4,
      column: 85
    }
  ]
});

// ------------------------------------------------------------------------
// Testing %
// ------------------------------------------------------------------------

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { width: 10%; }",
      description: "10%."
    },
    {
      code: "a { width: 10% 2; }",
      description: "10% 2."
    },
    {
      code: "a { width: 10% $var; }",
      description: "10% $var."
    },
    {
      code: "a { width: 10% fn(); }",
      description: "10% fn()."
    },
    {
      code: "a { width: 10% (1 + 3); }",
      description: "10% (1 + 3)."
    },
    {
      code: "a { width: #{$var}% 2; }",
      description: "#{$var}% 2."
    },
    {
      code: "a { width: 10% -2; }",
      description: "10% -2."
    },
    {
      code: "a { width: 10% -fn(); }",
      description: "10% -fn()."
    },
    {
      code: "a { width: #{$var}% -2; }",
      description: "#{$var}% -2."
    },
    {
      code: "a { width: #{$var}% - 2; }",
      description: "#{$var}% - 2."
    },
    {
      code: "a { width: #{$var} %2; }",
      description: "#{$var} %2."
    },
    {
      code: "a { width: $var %#{2}; }",
      description: "$var %#{2}."
    },
    {
      // In these the - is and op, not the %
      code: "a { width: 10% - 2; }",
      description: "10% - 2."
    },
    {
      code: "a { width: 10% - $var; }",
      description: "10% - $var."
    },
    {
      code: "a { width: 10% - fn(); }",
      description: "10% - fn()."
    },
    {
      code: "a { width: 10% - (1 + 3); }",
      description: "10% - (1 + 3)."
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i % 2}-down-dark.svg);
      }
      `,
      description:
        "Op %: background-image with absolute path inside url function and interpolation."
    }
  ],

  reject: [
    {
      code: "a { width: $var% 2; }",
      description: "$var% 2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: fn()% 2; }",
      description: "fn()% 2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: (10 + 1)% 2; }",
      description: "(10 + 1)% 2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: $var% -2; }",
      description: "$var% -2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: fn()% -2; }",
      description: "fn()% -2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: (10 + 1)% -2; }",
      description: "(10 + 1)% -2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: $var% - 2; }",
      description: "$var% - 2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: fn()% - 2; }",
      description: "fn()% - 2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: (10 + 1)% - 2; }",
      description: "(10 + 1)% - 2.",
      message: messages.expectedBefore("%")
    },
    {
      code: "a { width: 10 %2; }",
      description: "10 %2.",
      message: messages.expectedAfter("%")
    },
    {
      code: "a { width: 10 %$var; }",
      description: "10 %$var.",
      message: messages.expectedAfter("%")
    },
    {
      code: "a { width: $var %2; }",
      description: "$var %2.",
      message: messages.expectedAfter("%")
    },
    {
      code: "a { width: fn() %2; }",
      description: "fn() %2.",
      message: messages.expectedAfter("%")
    },
    {
      code: "a { width: (10 + 1) %2; }",
      description: "(10 + 1) %2.",
      message: messages.expectedAfter("%")
    },
    {
      // minus is op in these:
      code: "a { width: 10% -$var; }",
      description: "10% -$var.",
      message: messages.expectedAfter("-")
    },
    {
      code: "a { width: 10% -(1 + 3); }",
      description: "10% -(1 + 3).",
      message: messages.expectedAfter("-")
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i %2}-down-dark.svg);
      }
      `,
      description:
        "Op %: background-image with relative path inside url function and interpolation.",
      message: messages.expectedAfter("%"),
      line: 4,
      column: 86
    },
    {
      code: `
      $i: 10;
      .thing {
        background-image: url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i% 2}-down-dark.svg);
      }
      `,
      description:
        "Op %: background-image with relative path inside url function and interpolation.",
      message: messages.expectedBefore("%"),
      line: 4,
      column: 85
    }
  ]
});

// ------------------------------------------------------------------------
// Inside strings, interpolations, newlines, etc.
// ------------------------------------------------------------------------

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: 'a { width: "10*1"; }',
      description: 'A string: "10*1".'
    },
    {
      code: "a { width: '10* 1'; }",
      description: "A string: '10* 1'."
    },
    {
      code: 'a { width: "10 \\" 10*1"; }',
      description: 'A string: "10 \\" 10*1".'
    }
  ],

  reject: [
    {
      code: 'a { width: "#{10 %1}"; }',
      message: messages.expectedAfter("%"),
      description: 'Op (interpolation inside a string): "#{10 %1}".'
    }
  ]
});

// double -
// In many cases these work as indended, but in general we send double signs packing
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "a { width: 1 --a; }",
      description: "Chars: 1 --a."
    },
    {
      code: "a { width: 1--a; }",
      description: "Chars: 1--a."
    },
    {
      code: "a { width: 1px-- 1px; }",
      description: "Chars: 1px-- 1px."
    },
    {
      code: "a { width: #fac --#365; }",
      description: "Chars: #fac --#365."
    },
    {
      code: "a { width: #fac -- #365; }",
      description: "Chars: #fac -- #365."
    },
    {
      code: "a { width: $var---; }",
      description: "Variable part: $var---."
    }
  ]
});

// Newlines, multiple spaces
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      a {
        width: 1 -
          a;
      }
    `,
      description:
        "operator-newline-indentation (spaces)-operand: 1 -\\n          a."
    },
    {
      code: `
      a {
        width: 1 -
a;
      }
    `,
      description: "Operator-newline-operand: 1 -\\na."
    },
    {
      code: `
      a {
        width: 1
- a;
      }
    `,
      description: "Operand-newline-operator: 1\\n- a."
    },
    {
      code: `
      a {
        width: 1
          - a;
      }
    `,
      description: "Operand-newline-indentation-operator: 1\\n-          a."
    },
    {
      code: `
      a {
        width: 1
- 1;
      }
    `,
      description: "Multiple spaces-newline-operator (ignored): 1  \\n- 1."
    }
  ],

  reject: [
    {
      code: `
      a {
        width: 1 -

          a+ 1;
      }
    `,
      message: messages.expectedBefore("+"),
      description:
        "Operator-spaces-newline-indentation-operand and a breaching operator: 1 -  \\na+ 1.",
      line: 5,
      column: 12
    },
    {
      code: "a { width: 1 -  1; }",
      message: messages.expectedAfter("-"),
      description: "Two spaces after: 1 -  1.",
      line: 1,
      column: 14
    },
    {
      code: "a { width: 1  - 1; }",
      message: messages.expectedBefore("-"),
      description: "Two spaces before: 1  - 1.",
      line: 1,
      column: 15
    }
  ]
});

// ------------------------------------------------------------------------
// Testing in non-value nodes
// ------------------------------------------------------------------------

// Selectors, property names
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "p>p { color: red; }",
      description: "Selector combinator, +."
    },
    {
      code: "p+p { color: red; }",
      description: "Selector combinator, >."
    },
    {
      code: "p { background-color: red; }",
      description: "Property part, -: background-color: red."
    },
    {
      code: ".class#{1 + 1}name { color: red; }",
      description:
        "Interpolation in selector (proper spaces): .class#{1 + 1}name."
    }
  ],

  reject: [
    {
      code: ".class#{1 +1}name { color: red; }",
      description: "Interpolation in a selector: .class#{1 +1}name.",
      message: messages.expectedAfter("+"),
      column: 11
    },
    {
      code: "#id, .class#{1 +1}name { color: red; }",
      description:
        "Interpolation in a selector (second in a list): .#id, class#{1 +1}name.",
      message: messages.expectedAfter("+"),
      column: 16
    },
    {
      code: `
      .class#{1 +1}name { color: red; }
    `,
      description:
        "Interpolation in selector, newline and indentation before: .class#{1 +1}name.",
      line: 2,
      column: 17,
      message: messages.expectedAfter("+")
    },
    {
      code: ".cl#{ $var>= 10 }n { color: red; }",
      description: "Interpolation in selector: .cl#{ $var>= 10 }n.",
      message: messages.expectedBefore(">="),
      column: 11
    },
    {
      code: 'p { background-#{"col" +"or"}: red; }',
      description: 'Interpolation in prop name: background-#{"col" +"or"}.',
      message: messages.expectedAfter("+"),
      // backslashes excluded
      column: 24
    },
    {
      code: 'p { background-#{"col"+ "or"}: red; }',
      description: 'Interpolation in prop name: background-#{"col"+ "or"}.',
      message: messages.expectedBefore("+"),
      // backslashes excluded
      column: 23
    }
  ]
});

// ------------------------------------------------------------------------
// Relational and equity operators
// ------------------------------------------------------------------------

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { width: $var !=1; }",
      description: "Op: $var !=1.",
      message: messages.expectedAfter("!="),
      column: 17
    },
    {
      code: "a { width: $var< 1; }",
      description: "Op: $var< 1.",
      message: messages.expectedBefore("<"),
      column: 16
    },
    {
      code: "a { width: $var >1; }",
      description: "Op: $var >1.",
      message: messages.expectedAfter(">"),
      column: 17
    },
    {
      code: "a { width: $var ==1; }",
      description: "Op: $var ==1.",
      message: messages.expectedAfter("=="),
      column: 17
    },
    {
      code: "a { width: string== string; }",
      description: "Op: string== string.",
      message: messages.expectedBefore("=="),
      column: 18
    },
    {
      code: "a { width: string ==string; }",
      description: "Op: string ==string.",
      message: messages.expectedAfter("=="),
      column: 19
    }
  ]
});

// ------------------------------------------------------------------------
// Interpolation inside comments
// ------------------------------------------------------------------------

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "/* #{10 + 1} */",
      description: "/* #{10 + 1} */."
    },
    {
      code: "// #{10+ 1}",
      description: "// #{10+ 1}."
    }
  ],

  reject: [
    {
      code: "/* #{10+ 1} */",
      description: "/* #{10+ 1} */.",
      message: messages.expectedBefore("+"),
      column: 8
    },
    {
      code: `
      a, /* #{10+ 1} */
      b
      { width: 10px; }`,
      description: "Comment after selector.",
      message: messages.expectedBefore("+"),
      line: 2,
      column: 17
    },
    {
      code: `
      a,
      b /* #{10+ 1} */
      { width: 10px; }`,
      description: "Comment after selector #2.",
      message: messages.expectedBefore("+"),
      line: 3,
      column: 16
    }
  ]
});

// Operations without whitespaces on any of the sides
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  reject: [
    {
      code: "a { width: #{$var}+#ffc; }",
      description: "+ without whitespaces: `#{$var}+#ffc`.",
      warnings: [
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("+")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedAfter("+")
        }
      ]
    },
    {
      code: "a { width: 1+1s; }",
      description: "+ without whitespaces: `1+1s`.",
      warnings: [
        {
          line: 1,
          column: 13,
          message: messages.expectedBefore("+")
        },
        {
          line: 1,
          column: 13,
          message: messages.expectedAfter("+")
        }
      ]
    },
    {
      code: "a { width: 5px-3px; }",
      description: "- without whitespaces: `5px-3px`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: .1px-1px; }",
      description: "- without whitespaces: `.1px-1px`.",
      warnings: [
        {
          line: 1,
          column: 16,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 16,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: s.1px-1; }",
      description: "- without whitespaces: `s.1px-1`.",
      warnings: [
        {
          line: 1,
          column: 17,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: fn()-1; }",
      description: "fn()-1",
      warnings: [
        {
          line: 1,
          column: 16,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 16,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: fn()/1; }",
      description: "fn()/1",
      warnings: [
        {
          line: 1,
          column: 16,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 16,
          message: messages.expectedAfter("/")
        }
      ]
    },
    {
      code: "a { width: $var==1; }",
      description: "$var==1",
      warnings: [
        {
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 18,
          message: messages.expectedBefore("==")
        },
        {
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 18,
          message: messages.expectedAfter("==")
        }
      ]
    },
    {
      code: "a { width: var==var; }",
      description: "var==var",
      warnings: [
        {
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 17,
          message: messages.expectedBefore("==")
        },
        {
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 17,
          message: messages.expectedAfter("==")
        }
      ]
    }
  ]
});

// Equity operators
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  reject: [
    {
      code: "a { width: $var==1; }",
      description: "$var==1",
      warnings: [
        {
          line: 1,
          column: 16,
          message: messages.expectedBefore("==")
        },
        {
          line: 1,
          column: 16,
          message: messages.expectedAfter("==")
        }
      ]
    },
    {
      code: "a { width: var==var; }",
      description: "var==var",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("==")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("==")
        }
      ]
    }
  ]
});

// Slash, another operation after
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  reject: [
    {
      code: "a { width: 8px/2px +$var; }",
      description: "8px/2px +$var`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 20,
          message: messages.expectedAfter("+")
        }
      ]
    },
    {
      code: "a { width: #{$var}+8px/2px; }",
      description:
        "#{$var}+8px/2px (+ is not math op, so isn't /. But + is concatenation, so it gives warnings).",
      warnings: [
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("+")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedAfter("+")
        }
      ]
    },
    {
      code: "a { width: 8px/2px+ $var; }",
      description: "8px/2px+ $var`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("+")
        }
      ]
    },
    {
      code: "a { width: 8px/2px +fn(); }",
      description: "8px/2px +fn()`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 20,
          message: messages.expectedAfter("+")
        }
      ]
    },
    {
      code: "a { width: 8px/2px+ fn(); }",
      description: "8px/2px+ fn()`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("+")
        }
      ]
    },
    {
      code: "a { width: 8px/2px+ 5px; }",
      description: "8px/2px+ 5px`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("+")
        }
      ]
    },
    {
      code: "a { width: 8px/2px+ 5; }",
      description: "8px/2px+ 5`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("+")
        }
      ]
    },
    {
      code: "a { width: 8px/2px -$var; }",
      description: "8px/2px -$var`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 20,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: 8px/2-$var; }",
      description: "8px/2-$var`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: 8px/2- $var; }",
      description: "8px/2- $var`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedBefore("-")
        }
      ]
    },
    {
      code: "a { width: 8px/2- 5px; }",
      description: "8px/2- 5px`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedBefore("-")
        }
      ]
    },
    {
      code: "a { width: 8px/2px-5px; }",
      description: "8px/2px-5px`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: 8px/2-5px; }",
      description: "8px/2-5px`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: 8px/2px-5; }",
      description: "8px/2px-5`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedAfter("-")
        }
      ]
    },
    {
      code: "a { width: 8px/2-5; }",
      description: "8px/2-5`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("/")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedBefore("-")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedAfter("-")
        }
      ]
    }
  ]
});

// Slash, operation before
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  reject: [
    {
      code: "a { width: 5+8px/2; }",
      description: "5+8px/2`.",
      warnings: [
        {
          line: 1,
          column: 13,
          message: messages.expectedBefore("+")
        },
        {
          line: 1,
          column: 13,
          message: messages.expectedAfter("+")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 17,
          message: messages.expectedAfter("/")
        }
      ]
    },
    {
      code: "a { width: 5px*8px/2; }",
      description: "5px*8px/2`.",
      warnings: [
        {
          line: 1,
          column: 15,
          message: messages.expectedBefore("*")
        },
        {
          line: 1,
          column: 15,
          message: messages.expectedAfter("*")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 19,
          message: messages.expectedAfter("/")
        }
      ]
    },
    {
      code: "a { width: 5px - 8px/2; }",
      description: "5px - 8px/2`.",
      warnings: [
        {
          line: 1,
          column: 21,
          message: messages.expectedBefore("/")
        },
        {
          line: 1,
          column: 21,
          message: messages.expectedAfter("/")
        }
      ]
    }
  ]
});

// ------------------------------------------------------------------------
// @media rules
// ------------------------------------------------------------------------

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      @media (max-width: 100px + 1) {
        a {color: red;}
      }
    `,
      description: "Media feature value: @media (max-width: 100px + 1)."
    }
  ],

  reject: [
    {
      code: `
      @media #{'scr' +'en'} and (color) {
        a {color: red;}
      }
    `,
      description:
        "Media type as interpolation: @media #{'scr' +'en'} and (color).",
      line: 2,
      column: 22,
      message: messages.expectedAfter("+")
    },
    {
      code: ` @media
      #{'scr' +'en'} and (color) {
        a {color: red;}
      }
    `,
      description:
        "Media type as interpolation, newlines messed: @media #{'scr' +'en'} and (color).",
      line: 2,
      column: 15,
      message: messages.expectedAfter("+")
    },
    {
      code: `
      @media #{'scr' +'en'} {
        a {color: red;}
      }
    `,
      description: "Media query as interpolation: @media #{'scr' +'en'}.",
      line: 2,
      column: 22,
      message: messages.expectedAfter("+")
    },
    {
      code: `
      @media ( #{'max' +'-width'}: 100px) {
        a {color: red;}
      }
    `,
      description:
        "Media feature expression: @media (#{'max' +'-width': 100px}).",
      line: 2,
      column: 24,
      message: messages.expectedAfter("+")
    },
    {
      code: `
      @media (#{'max' +'-width: 100px'}) {
        a {color: red;}
      }
    `,
      description:
        "Media feature expression: @media (#{'max' +'-width: 100px'}).",
      line: 2,
      column: 23,
      message: messages.expectedAfter("+")
    },
    {
      code: `
      @media (max-width: 100px +1) {
        a {color: red;}
      }
    `,
      description: "Media feature value: @media (max-width: 100px +1).",
      line: 2,
      column: 32,
      message: messages.expectedAfter("+")
    },
    {
      code: `
      @media (min-width: 10px), (max-width: 100px +1) {
        a {color: red;}
      }
    `,
      description:
        "Value of a non-first media feature: @media (min-width: 10px), (max-width: 100px +1).",
      line: 2,
      column: 51,
      message: messages.expectedAfter("+")
    }
  ]
});

// ------------------------------------------------------------------------
// Escaped characters
// ------------------------------------------------------------------------

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      $test: (
        \\+:   10px,
        \\+\\+: 20px,
      );
      `,
      description: "Map with escaped chars"
    },
    {
      code: `
      .h-trans--all\\+ {
        color: red;
      }
      .test {
        @extend .h-trans--all\\+;
      }
      `,
      description: "@extend with escaped char"
    }
  ]
});

// Variables
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      $var: 10px/st;
    `,
      description: "Variable: $var: 10px/st;"
    }
  ],

  reject: [
    {
      code: `
      $var: 10px+ 1;
    `,
      description: "Variable (usual breach): $var: 10px+ 1;",
      line: 2,
      column: 17,
      message: messages.expectedBefore("+")
    },
    {
      code: `
      $var: 10px +1;
    `,
      description: "Variable (this is op too): $var: 10px +1;",
      line: 2,
      column: 18,
      message: messages.expectedAfter("+")
    },
    {
      code: `
      $var: 10px /1;
    `,
      description: "Variable (this is op too): $var: 10px /1;",
      line: 2,
      column: 18,
      message: messages.expectedAfter("/")
    }
  ]
});

// @function definitions
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [],

  reject: [
    {
      code: `
      @function fn ($a: 10px+ 1) {};
    `,
      description:
        "Function definition, param default (usual breach): @function fn ($a: 10px+ 1).",
      line: 2,
      column: 29,
      message: messages.expectedBefore("+")
    },
    {
      code: `
      @function fn ($a: 10px +1) {};
    `,
      description:
        "Function definition, param default (special breach): @function fn ($a: 10px +1).",
      line: 2,
      column: 30,
      message: messages.expectedAfter("+")
    },
    {
      code: `
      @function funct($b: 1 + 1, $a: 10px +1) {};
    `,
      description:
        "Function definition, param default (special breach): @function fn ($b, $a: 10px +1).",
      line: 2,
      column: 43,
      message: messages.expectedAfter("+")
    }
  ]
});

// @function calls inside interpolation
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      --my-var: #{scale-color(#fff, $lightness: -75%)};
    `,
      description:
        "Function call in interpolation, negative unit value parameter: #{scale-color(#fff, $lightness: -75%)}"
    },
    {
      code: `
      --my-var: #{math.acos(-0.5)};
    `,
      description:
        "Function call in interpolation, negative parameter: #{math.acos(-0.5)}"
    },
    {
      code: `
      --my-var: #{math.acos(0.7 - 0.5)};
    `,
      description:
        "Function call in interpolation, expression parameter: #{math.acos(0.7 - 0.5)}"
    }
  ],

  reject: [
    {
      code: `
      --my-var: #{math.acos(0.7-0.5)};
    `,
      description:
        "Function call in interpolation, expression parameter: #{math.acos(0.7-0.5)}",
      warnings: [
        {
          message: messages.expectedBefore("-"),
          line: 2,
          column: 32
        },
        {
          message: messages.expectedAfter("-"),
          line: 2,
          column: 32
        }
      ]
    }
  ]
});

// @import
testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  skipBasicChecks: true,

  accept: [
    {
      code: "@import url('//fonts.googleapis.com/css?family=Google+Material+Icons');",
      description: "Import url function w/ single-quoted string."
    },
    {
      code: '@import url("//fonts.googleapis.com/css?family=Google+Material+Icons");',
      description: "Import url function w/ double-quoted string."
    },
    {
      code: `
      @import url(//fonts.googleapis.com/css?family=Google+Material+Icons);
    `,
      description: "url function w/ unquoted string, no whitespace."
    }
  ],

  reject: [
    {
      code: "@import url(10px +2);",
      description: "Import w/o a media query: @import url(10px +2).",
      line: 1,
      column: 18,
      message: messages.expectedAfter("+")
    },
    {
      code: `@import
      url(10px +2);
    `,
      description: "Import w/o a media query: @import url(10px +2).",
      line: 2,
      column: 16,
      message: messages.expectedAfter("+")
    }
  ]
});

testRule({
  ruleName,
  config: [true],
  syntax: "html",
  skipBasicChecks: true,
  skip: true,

  accept: [
    {
      code: `
a {
  width: #{$var} + 1;
}
<style type="text/scss">
a {
  width: #{$var} + 1;
}
</style>
`
    }
  ],

  reject: [
    {
      code: `
a {
  width: 1 +$var;
}
<style type="text/scss">
a {
  width: 1 +$var;
}
</style>
`,
      message: messages.expectedAfter("+"),
      line: 7,
      column: 12
    }
  ]
});
