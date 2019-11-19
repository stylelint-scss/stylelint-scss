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
      @mixin foo {
      }
    `,
      description: "Regexp: sequence part. Example: full match, argumentless."
    },
    {
      code: `
      @mixin foo () {
      }
    `,
      description: "Regexp: sequence part. Example: full match."
    },
    {
      code: `
      @mixin foo ($links: 10){
      }
    `,
      description: "Regexp: sequence part. Example: full match, with params."
    },
    {
      code: `
      @mixin _foo ($n) {
      }
    `,
      description: "Regexp: sequence part. Example: matches at the end."
    },
    {
      code: `
      @mixin food ($n) {
      }
    `,
      description: "Regexp: sequence part. Example: matches at the beginning."
    },
    {
      code: `
      @mixin  foo ($n) {
      }
    `,
      description: "Regexp: sequence part. Example: space after @mixin."
    },
    {
      code: `
      @mix4in fowdo ($n) {
      }
    `,
      description: "Any pattern. Example: not a SCSS mixin, skipping."
    },
    {
      code: `
      @mixin
      foo
      ($n) {
      }
    `,
      description:
        "Regexp: sequence part. Example: newlines around a mixin name."
    }
  ],

  reject: [
    {
      code: `
      @mixin floo ($n) {
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
      @mixin foo ($p) {
      }
    `,
      description: "String: sequence part. Example: full match."
    },
    {
      code: `
      @mixin _foo ($p) {
      }
    `,
      description: "String: sequence part. Example: matches at the end."
    },
    {
      code: `
      @mixin food ($p) {
      }
    `,
      description: "String: sequence part. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: `
      @mixin floo ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "String: sequence part. Example: symbol in between."
    },
    {
      code: `
      @mixin fo ($p) {
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
      @mixin foo ($options: ()) {}
    `,
      description:
        "Regexp: strict match. Example: mixin with params that have parens INSIDE."
    },
    {
      code: `
      @mixin foo ($options: (), $lol: ()) {}
    `,
      description:
        "Regexp: strict match. Example: mixin with params that have parens INSIDE #2."
    },
    {
      code: `
      @mixin foo ($a: (), $b: .1meh, $c: foo(buzzz)) {
        color: red;
      }
    `,
      description:
        "Regexp: strict match. Example: mixin with params that have parens INSIDE #3."
    },
    {
      code: `
      @mixin foo {
      }
    `,
      description: "Regexp: strict match. Example: matches."
    },
    {
      code: `
      @mixin
      foo
      ($p) {
      }
    `,
      description:
        "Regexp: strict match. Example: newlines around a mixni name."
    },
    {
      code: `
      @mixin
      foo (
        $p
      ) {}
    `,
      description: "Regexp: strict match. Example: newline after a brace."
    }
  ],

  reject: [
    {
      code: `
      @mixin _foo {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "Regexp: strict match. Example: matches at the end."
    },
    {
      code: `
      @mixin food {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "Regexp: strict match. Example: matches at the beginning."
    },
    {
      code: `
      @mixin floo {
      }
    `,
      line: 2,
      message: messages.expected,
      description: "Regexp: strict match. Example: symbol in between."
    },
    {
      code: `
      @mixin 1
      foo
      ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description:
        "Regexp: strict match. Example: mixin name divided by newlines."
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
      @mixin foo {
      }
    `,
      description: "Regexp: pattern at the beginning. Example: matches."
    },
    {
      code: `
      @mixin food {
      }
    `,
      description:
        "Regexp: pattern at the beginning. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: `
      @mixin _foo ($p) {
      }
    `,
      line: 2,
      message: messages.expected,
      description:
        "Regexp: pattern at the beginning. Example: matches at the end."
    },
    {
      code: `
      @mixin floo ($p) {
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
      code: "@mixin Foo-bar  ( $p: 1 ) {}",
      description: "Regexp: SUIT component. Example: comply"
    },
    {
      code: "@mixin Foo-barBaz {}",
      description: "Regexp: SUIT component. Example: comply"
    }
  ],

  reject: [
    {
      code: "@mixin boo-Foo-bar ( $p) {}",
      line: 1,
      message: messages.expected,
      description:
        "Regexp: SUIT component. Example: starts with lowercase, two elements"
    },
    {
      code: "@mixin foo-bar ($p) {}",
      line: 1,
      message: messages.expected,
      description: "Regexp: SUIT component. Example: starts with lowercase"
    },
    {
      code: "@mixin Foo-Bar ($p) {}",
      line: 1,
      message: messages.expected,
      description:
        "Regexp: SUIT component. Example: element starts with uppercase"
    }
  ]
});
