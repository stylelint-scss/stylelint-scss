"use strict";

const { rule, ruleName, messages } = require("..");

// Testing against a ragex, sequence part
testRule(rule, {
  ruleName,
  config: [/foo/],
  syntax: "scss",

  accept: [
    {
      code: "%foo { top: 1em; }",
      description: "Regexp: sequence part. Example: full match."
    },
    {
      code: "%_foo { top: 1em; }",
      description: "Regexp: sequence part. Example: matches at the end."
    },
    {
      code: "%food { top: 1em; }",
      description: "Regexp: sequence part. Example: matches at the beginning."
    },
    {
      code: " %foo { top: 1em; }",
      description:
        "Regexp: sequence part. Example: extra space after before placeholder selector."
    },
    {
      code: ".fowdo { top: 1em; }",
      description: "Not a placeholder extend, skipping."
    },
    {
      code: "%clou#{dstri}fe { top: 1em; }",
      description: "Regexp: sequence part. Example: interpolation; skipping."
    }
  ],

  reject: [
    {
      code: "%floo { top: 1em; }",
      line: 1,
      message: messages.expected("floo"),
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
      code: "%foo { top: 1em; }",
      description: "String: sequence part. Example: full match."
    },
    {
      code: "%_foo { top: 1em; }",
      description: "String: sequence part. Example: matches at the end."
    },
    {
      code: "%food { top: 1em; }",
      description: "String: sequence part. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: "%floo { top: 1em; }",
      line: 1,
      message: messages.expected("floo"),
      description: "String: sequence part. Example: symbol in between."
    },
    {
      code: "%fo { top: 1em; }",
      line: 1,
      message: messages.expected("fo"),
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
      code: "%foo { top: 1em; }",
      description: "Regexp: strict match. Example: matches."
    },
    {
      code: `%foo
    {
      top: 1em;
    }`,
      description: "Regexp: strict match. Example: newline after a selector."
    }
  ],

  reject: [
    {
      code: "%_foo { top: 1em; }",
      line: 1,
      message: messages.expected("_foo"),
      description: "Regexp: strict match. Example: matches at the end."
    },
    {
      code: "% foo { top: 1em; }",
      line: 1,
      message: messages.expected(""),
      description:
        "Regexp: strict match. Example: matches, but has a space after '%'."
    },
    {
      code: "%food { top: 1em; }",
      line: 1,
      message: messages.expected("food"),
      description: "Regexp: strict match. Example: matches at the beginning."
    },
    {
      code: "%floo { top: 1em; }",
      line: 1,
      message: messages.expected("floo"),
      description: "Regexp: strict match. Example: symbol in between."
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
      code: "%foo { top: 1em; }",
      description: "Regexp: pattern at the beginning. Example: matches."
    },
    {
      code: "%food { top: 1em; }",
      description:
        "Regexp: pattern at the beginning. Example: matches at the beginning."
    }
  ],

  reject: [
    {
      code: "%_foo { top: 1em; }",
      line: 1,
      message: messages.expected("_foo"),
      description:
        "Regexp: pattern at the beginning. Example: matches at the end."
    },
    {
      code: "%floo { top: 1em; }",
      line: 1,
      message: messages.expected("floo"),
      description:
        "Regexp: pattern at the beginning. Example: symbol in between."
    }
  ]
});

// Testing against kinda-SUIT pattern, and nesting
testRule(rule, {
  ruleName,
  config: [/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/],
  syntax: "scss",

  accept: [
    {
      code: "%Foo-bar {}",
      description: "Regexp: SUIT component. Example: comply."
    },
    {
      code: "%Foo-barBaz {}",
      description: "Regexp: SUIT component. Example: comply."
    },
    {
      code: `%Foo-bar {
      &barBaz {}
    }`,
      description:
        "Regexp: SUIT component. Example: comply, nesting, both levels comply."
    },
    {
      code: ".cd { @media print { #de { & + .fg {} } } }",
      description:
        "Regexp: SUIT component. Example: no placeholder, should skip."
    }
  ],

  reject: [
    {
      code: "%boo-Foo-bar {}",
      line: 1,
      message: messages.expected("boo-Foo-bar"),
      description:
        "Regexp: SUIT component. Example: starts with lowercase, two elements."
    },
    {
      code: "%foo-bar {}",
      line: 1,
      message: messages.expected("foo-bar"),
      description: "Regexp: SUIT component. Example: starts with lowercase."
    },
    {
      code: "%Foo-Bar {}",
      line: 1,
      message: messages.expected("Foo-Bar"),
      description:
        "Regexp: SUIT component. Example: element starts with uppercase."
    },
    {
      code: `%Foo-bar {
      a,
      &1oo {}
    }`,
      line: 3,
      message: messages.expected("Foo-bar1oo"),
      description:
        "Regexp: SUIT component. Example: nesting, only lv1 part comply."
    },
    {
      code: `%Fo {
      &o-bar {
        color: red;
      }
    }`,
      line: 1,
      message: messages.expected("Fo"),
      description:
        "Regexp: pattern at the beginning. Example: nesting, with nesting selector; first lv doesn't comply."
    }
  ]
});

// Testing against a ragex, sequence part
testRule(rule, {
  ruleName,
  config: [/foo/],
  syntax: "less",

  accept: [
    {
      code: "a { .mixin-call(); }",
      description: "Less mixin call ignored."
    },
    {
      code: "a { &:extend(%class); }",
      description: "Less extends ignored."
    }
  ]
});
