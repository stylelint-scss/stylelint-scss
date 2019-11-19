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
testRule(rule, {
  ruleName,
  config: [/^foo$/],
  syntax: "scss",

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
testRule(rule, {
  ruleName,
  config: [/^foo/],
  syntax: "scss",

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
testRule(rule, {
  ruleName,
  config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/],
  syntax: "scss",

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
testRule(rule, {
  ruleName,
  config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, { ignore: "local" }],
  syntax: "scss",

  accept: [
    {
      code: "a { $oo-bar: 0; }",
      description: "Ignore local variable (not matching the pattern)."
    },
    {
      code: "$Foo-barBaz: 0;",
      description:
        "Ignore local variable (passing global, matching the pattern)."
    }
  ],

  reject: [
    {
      code: "$boo-Foo-bar: 0;",
      line: 1,
      message: messages.expected,
      description:
        "Ignore local variable (passing global, not matching the pattern)."
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, { ignore: "global" }],
  syntax: "scss",

  accept: [
    {
      code: "$oo-bar: 0;",
      description: "Ignore global variable (not matching the pattern)."
    },
    {
      code: "a { $Foo-barBaz: 0; }",
      description:
        "Ignore global variable (passing local, matching the pattern)."
    }
  ],

  reject: [
    {
      code: "a { $boo-Foo-bar: 0; }",
      line: 1,
      message: messages.expected,
      description:
        "Ignore global variable (passing local, not matching the pattern)."
    }
  ]
});
