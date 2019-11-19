"use strict";

const { rule, ruleName, messages } = require("..");

// Testing against a ragex, sequence part
testRule(rule, {
  ruleName,
  config: [/foo/],
  syntax: "scss",

  accept: [
    {
      code: `
      @function foo () {
      }
    `,
      description: "Regexp: sequence part. Example: full match."
    },
    {
      code: `
      @function foo ($links: 10){
      }
    `,
      description: "Regexp: sequence part. Example: full match, with params."
    },
    {
      code: `
      @function _foo ($n) {
      }
    `,
      description: "Regexp: sequence part. Example: matches at the end."
    },
    {
      code: `
      @function food ($n) {
      }
    `,
      description: "Regexp: sequence part. Example: matches at the beginning."
    },
    {
      code: `
      @function  foo ($n) {
      }
    `,
      description: "Regexp: sequence part. Example: space after @function."
    },
    {
      code: `
      @functio1n fowdo ($n) {
      }
    `,
      description: "Any pattern. Example: not a SCSS function, skipping."
    },
    {
      code: `
      @function
      foo
      ($n) {
      }
    `,
      description:
        "Regexp: sequence part. Example: newlines around a function name."
    },
    {
      code: `
      @function
      foo (
        $n
      ) {}
    `,
      description: "Regexp: sequence part. Example: newline after a brace."
    }
  ],

  reject: [
    {
      code: `
      @function floo ($n) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "Regexp: sequence part. Example: symbol in between."
    }
  ]
});

// Testing against a string, sequence part
testRule(rule, {
  ruleName,
  config: ["foo"],
  syntax: "scss",

  accept: [
    {
      code: `
      @function foo ($p) {
      }
    `,
      description: "String: sequence part. Example: full match."
    },
    {
      code: `
      @function _foo ($p) {
      }
    `,
      description: "String: sequence part. Example: matches at the end."
    },
    {
      code: `
      @function food ($p) {
      }
    `,
      description: "String: sequence part. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: `
      @function floo ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "String: sequence part. Example: symbol in between."
    },
    {
      code: `
      @function fo ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "String: sequence part. Example: not a full sequence."
    }
  ]
});

// Testing against a regex, full match
testRule(rule, {
  ruleName,
  config: [/^foo$/],
  syntax: "scss",

  accept: [
    {
      code: `
      @function foo ($options: ()) {}
    `,
      description:
        "Regexp: strict match. Example: function with params that have parens INSIDE."
    },
    {
      code: `
      @function foo ($options: (), $lol: ()) {}
    `,
      description:
        "Regexp: strict match. Example: function with params that have parens INSIDE #2."
    },
    {
      code: `
      @function foo ($a: (), $b: .1meh, $c: foo(buzzz)) {
        color: red;
      }
    `,
      description:
        "Regexp: strict match. Example: function with params that have parens INSIDE #3."
    },
    {
      code: `
      @function foo ($p) {
      }
    `,
      description: "Regexp: strict match. Example: matches."
    },
    {
      code: `
      @function
      foo
      ($p) {
      }
    `,
      description:
        "Regexp: strict match. Example: newlines around a function name."
    }
  ],

  reject: [
    {
      code: `
      @function _foo ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "Regexp: strict match. Example: matches at the end."
    },
    {
      code: `
      @function food ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "Regexp: strict match. Example: matches at the beginning."
    },
    {
      code: `
      @function floo ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "Regexp: strict match. Example: symbol in between."
    },
    {
      code: `
      @function 1
      foo
      ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description:
        "Regexp: strict match. Example: function name divided by newlines."
    }
  ]
});

// Testing against a regex, match at the beginning
testRule(rule, {
  ruleName,
  config: [/^foo/],
  syntax: "scss",

  accept: [
    {
      code: `
      @function foo ($p) {
      }
    `,
      description: "Regexp: pattern at the beginning. Example: matches."
    },
    {
      code: `
      @function food ($p) {
      }
    `,
      description:
        "Regexp: pattern at the beginning. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: `
      @function _foo ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description:
        "Regexp: pattern at the beginning. Example: matches at the end."
    },
    {
      code: `
      @function floo ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description:
        "Regexp: pattern at the beginning. Example: symbol in between."
    }
  ]
});

// Testing against a regex, SUIT naming
testRule(rule, {
  ruleName,
  config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/],
  syntax: "scss",

  accept: [
    {
      code: "@function Foo-bar  ( $p: 1 ) {}",
      description: "Regexp: SUIT component. Example: comply"
    },
    {
      code: "@function Foo-barBaz {}",
      description: "Regexp: SUIT component. Example: comply"
    }
  ],

  reject: [
    {
      code: "@function boo-Foo-bar ( $p) {}",
      line: 1,
      message: messages.expected,
      description:
        "Regexp: SUIT component. Example: starts with lowercase, two elements"
    },
    {
      code: "@function foo-bar ($p) {}",
      line: 1,
      message: messages.expected,
      description: "Regexp: SUIT component. Example: starts with lowercase"
    },
    {
      code: "@function Foo-Bar ($p) {}",
      line: 1,
      message: messages.expected,
      description:
        "Regexp: SUIT component. Example: element starts with uppercase"
    }
  ]
});
