"use strict";

const postcss = require("postcss");
const scss = require("postcss-scss");
const { rule, ruleName, messages } = require("..");

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

// ------------------------------------------------------------------------
// Testing +
// ------------------------------------------------------------------------

// +, before a number (with or without a unit)
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
      column: 15
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
      description: "Op (1px + s). c5: 1px +s.1px."
    }
  ]
});

// +, before a color
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { d2: #{$var} +#ffc; }",
      description: "Op (concatenates at least): #{$var} +#ffc."
    },
    {
      code: "a { d: 1 +#ffc; }",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { plusafter1: 1+ 1; }",
      description: "Op: 1+ 1."
    },
    {
      code: "a { plusafter11: 1+ 1px; }",
      description: "Op: 1+ 1px."
    },
    {
      code: "a { plusafter12: 1+ px; }",
      description: "Op: 1+ px."
    },
    {
      code: "a { plusafter13: 1+ #0ff; }",
      description: "Op: 1+ #0ff."
    },
    {
      code: "a { plusafter14: 1+ $var; }",
      description: "Op: 1+ $var."
    },
    {
      code: "a { plusafter14: 1+ fn(); }",
      description: "Op: 1+ fn()."
    },
    {
      code: "a { plusafter2: 1px+ 1; }",
      description: "Op: 1px+ 1."
    },
    {
      code: "a { plusafter21: 1px+ 1px; }",
      description: "Op: 1px+ 1px."
    },
    {
      code: "a { plusafter22: 1px+ px; }",
      description: "Op: 1px+ px."
    },
    {
      code: "a { plusafter24: 1px+ $var; }",
      description: "Op: 1px+ $var."
    },
    {
      code: "a { plusafter14: 1px+ fn(); }",
      description: "Op: 1px+ fn()."
    },
    {
      code: "a { plusafter3: #0f0+ 1; }",
      description: "Op: #0f0+ 1."
    },
    {
      code: "a { plusafter22: #0f0+ px; }",
      description: "Op: #0f0+ px."
    },
    {
      code: "a { plusafter13: #0f0+ #0ff; }",
      description: "Op: #0f0+ #0ff."
    },
    {
      code: "a { plusafter24: #0f0+ $var1; }",
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
      description: "Op (since Sass 4): #0f0+ #{$var}."
    }
  ]
});

// ------------------------------------------------------------------------
// Testing -
// ------------------------------------------------------------------------

// - before a number/unit
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { b: 1 -$var; }",
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
      description: "Op: 1px -$var."
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { minusafter1: 1- 1; }",
      description: "Op: 1- 1."
    },
    {
      code: "a { minusafter11: 1- 1px; }",
      description: "Op: 1- 1px."
    },
    {
      code: "a { minusafter110: (1- 1px); }",
      description: "Op: (1- 1px)."
    },
    {
      code: "a { minusafter12: 1- px; }",
      description: "Op (though concatenated): 1- px."
    },
    {
      code: "a { minusafter13: 1- #0ff; }",
      description: "Op (though concatenated): 1- #0ff."
    },
    {
      code: "a { minusafter15: 1- $var; }",
      description: "Op: 1- $var."
    },
    {
      code: "a { minusafter16: 1- fn(); }",
      description: "Op: 1- fn()."
    },
    {
      code: "a { minusafter15: 1- #{$var}; }",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { minusafter3: #0f0- 1; }",
      description: "Op: #0f0- 1."
    },
    {
      code: "a { minusafter22: #0f0- px; }",
      description: "Op (concat): #0f0- px."
    },
    {
      code: "a { minusafter13: #0f0- #0ff; }",
      description: "Op: #0f0- #0ff."
    },
    {
      code: "a { minusafter24: #0f0- $var1; }",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
      code:
        'a { background-image: url(if($bootstrap-sass-asset-helper, twbs-image-path("#{$var-1x}"), "#{$var-1x}")); }',
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
    }
  ]
});

// - next to parens
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
      description: "Op: (1px/ 1px)."
    },
    {
      code: "a { slash12: 1px /$var; }",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
      description: 'Op (interpolation inside a string): "#{10 %1}".'
    }
  ]
});

// double -
// In many cases these work as indended, but in general we send double signs packing
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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

  // reject: [ {
  // code: "a { width: 1 --1; }",
  // description: "Should be op: 1 --1.",
  // }, {
  // code: "a { width: 1-- 1; }",
  // description: "Should be op: 1-- 1.",
  // }, {
  // code: "a { width: 1px --1px; }",
  // description: "Should be op: 1px --1px.",
  // } ],
});

// test("1--1", t => {
// t.plan(5)
// postcss([rule()])
// .process("a { width: 1-- 1; }", { syntax: scss })
// .then(result => {
// const warnings = result.warnings()
// t.equal(warnings.length, 2)
// t.equal(warnings[0].text, messages.expectedBefore("-"))
// t.equal(warnings[0].column, 13)
// t.equal(warnings[1].text, messages.expectedAfter("-"))
// t.equal(warnings[1].column, 13)
// })
// .catch(logError)
// })

// Newlines, multiple spaces
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
      description:
        "Operator-spaces-newline-indentation-operand and a breaching operator: 1 -  \\na+ 1.",
      line: 5,
      column: 12
    },
    {
      code: "a { width: 1 -  1; }",
      description: "Two spaces after: 1 -  1.",
      line: 1,
      column: 14
    },
    {
      code: "a { width: 1  - 1; }",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
  skipBasicChecks: true,

  reject: [
    {
      code: "a { width: $var !=1; }",
      description: "Op: $var !=1.",
      message: messages.expectedAfter("!="),
      column: 18
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
      column: 18
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
      column: 20
    }
  ]
});

// ------------------------------------------------------------------------
// Interpolation inside comments
// ------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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

// ------------------------------------------------------------------------
// These register more than one warning.
// ------------------------------------------------------------------------

// ---- just operations without whitespaces on any of the sides ----

test("+ without whitespaces: `#{$var}+#ffc`.", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: #{$var}+#ffc; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("+"));
      expect(warnings[0].column).toBe(19);
      expect(warnings[1].text).toBe(messages.expectedAfter("+"));
      expect(warnings[1].column).toBe(19);
    })
    .catch(logError);
});

test("+ without whitespaces: `1+1s`.", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: 1+1s; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("+"));
      expect(warnings[0].column).toBe(13);
      expect(warnings[1].text).toBe(messages.expectedAfter("+"));
      expect(warnings[1].column).toBe(13);
    })
    .catch(logError);
});

test("- without whitespaces: `5px-3px`.", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: 5px-3px; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("-"));
      expect(warnings[0].column).toBe(15);
      expect(warnings[1].text).toBe(messages.expectedAfter("-"));
      expect(warnings[1].column).toBe(15);
    })
    .catch(logError);
});

test("- without whitespaces: `.1px-1px`.", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: .1px-1px; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("-"));
      expect(warnings[0].column).toBe(16);
      expect(warnings[1].text).toBe(messages.expectedAfter("-"));
      expect(warnings[1].column).toBe(16);
    })
    .catch(logError);
});

test("- without whitespaces: `s.1px-1`.", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: s.1px-1; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("-"));
      expect(warnings[0].column).toBe(17);
      expect(warnings[1].text).toBe(messages.expectedAfter("-"));
      expect(warnings[1].column).toBe(17);
    })
    .catch(logError);
});

test("fn()-1", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: fn()-1; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("-"));
      expect(warnings[0].column).toBe(16);
      expect(warnings[1].text).toBe(messages.expectedAfter("-"));
      expect(warnings[1].column).toBe(16);
    })
    .catch(logError);
});

test("fn()/1", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: fn()/1; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("/"));
      expect(warnings[0].column).toBe(16);
      expect(warnings[1].text).toBe(messages.expectedAfter("/"));
      expect(warnings[1].column).toBe(16);
    })
    .catch(logError);
});

// ---- Equity operators ----

test("$var==1", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: $var==1; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("=="));
      expect(warnings[0].column).toBe(16);
      expect(warnings[1].text).toBe(messages.expectedAfter("=="));
      expect(warnings[1].column).toBe(17);
    })
    .catch(logError);
});

test("var==var", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: var==var; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("=="));
      expect(warnings[0].column).toBe(15);
      expect(warnings[1].text).toBe(messages.expectedAfter("=="));
      expect(warnings[1].column).toBe(16);
    })
    .catch(logError);
});

// ---- Slash, another operation after ----

test("8px/2px +$var`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px +$var; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});

test("#{$var}+8px/2px (+ is not math op, so isn't /. But + is concatenation, so it gives warnings).", () => {
  expect.assertions(5);

  return postcss([rule()])
    .process("a { width: #{$var}+8px/2px; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expectedBefore("+"));
      expect(warnings[0].column).toBe(19);
      expect(warnings[1].text).toBe(messages.expectedAfter("+"));
      expect(warnings[1].column).toBe(19);
    })
    .catch(logError);
});
test("8px/2px+ $var`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px+ $var; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});
test("8px/2px +fn()`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px +fn(); }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});
test("8px/2px+ fn()`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px+ fn(); }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});
test("8px/2px+ 5px`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px+ 5px; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});
test("8px/2px+ 5`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px+ 5; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});

test("8px/2px -$var`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px -$var; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});
test("8px/2-$var`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2-$var; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(4);
    })
    .catch(logError);
});
test("8px/2- $var`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2- $var; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});
test("8px/2- 5px`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2- 5px; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
    })
    .catch(logError);
});
test("8px/2px-5px`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px-5px; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(4);
    })
    .catch(logError);
});
test("8px/2-5px`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2-5px; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(4);
    })
    .catch(logError);
});
test("8px/2px-5`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2px-5; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(4);
    })
    .catch(logError);
});
test("8px/2-5`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 8px/2-5; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(4);
    })
    .catch(logError);
});

// Slash, operation before

test("5+8px/2`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 5+8px/2; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(4);
    })
    .catch(logError);
});
test("5px*8px/2`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 5px*8px/2; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(4);
    })
    .catch(logError);
});
test("5px - 8px/2`.", () => {
  expect.assertions(1);

  return postcss([rule()])
    .process("a { width: 5px - 8px/2; }", { syntax: scss, from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
    })
    .catch(logError);
});

// ------------------------------------------------------------------------
// @media rules
// ------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
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

// @import
testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
  skipBasicChecks: true,

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

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "html",
  skipBasicChecks: true,

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
      message: messages.rejected,
      line: 7,
      column: 12
    }
  ]
});
