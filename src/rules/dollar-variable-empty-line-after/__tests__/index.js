import { messages, ruleName } from "..";

// always
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      $var1: 100px;

    }`,
      description: "always. $var inside a rule, emptyline after."
    },
    {
      code: `a {
      $var1: 100px;

      $var1: 100px;

    }`,
      description: "always. Two $var-s inside a rule, emptyline after both."
    },
    {
      code: "$var1: 100px;",
      description: "always. $var in root, no emptyline after."
    },
    {
      code: `
      $var1: 100px;


      @import '1.css';
    `,
      description: "always. $var in root, not the last, multiple newlines."
    },
    {
      code: "a { $var1: 100px;\n\n}",
      description: "always. Unix newline"
    },
    {
      code: "a { $var1: 100px;\r\n\r\n}",
      description: "always. Windows newline"
    },
    {
      code: "a { $var1: 100px;\n\r\n}",
      description: "always. Mixed newline"
    },
    {
      code: "a { width: 100px; }",
      description: "always. Not a $-variable"
    }
  ],

  reject: [
    {
      code: `a {
      $var1: 100px;
    }`,
      fixed: `a {
      $var1: 100px;

    }`,
      description: "always. $var inside a rule, no emptyline after.",
      message: messages.expected,
      line: 2,
      column: 7
    },
    {
      code: `
      $var1: 100px;
      $var1: 100px;

    `,
      fixed: `
      $var1: 100px;

      $var1: 100px;

    `,
      description:
        "always. Two $var-s at the root start, no empty line between them.",
      message: messages.expected,
      line: 2,
      column: 7
    }
  ]
});

// never
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["never"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
    $var1: 100px;
  }`,
      description: "never. $var inside a rule, no emptyline after."
    },
    {
      code: `
    $var1: 100px;

  `,
      description: "never. $var in root, the last, has newline."
    },
    {
      code: `a {
    width: 100px;

  }`,
      description: "never. Not a $-variable"
    }
  ],

  reject: [
    {
      code: `a {
    $var1: 100px;

  }`,
      fixed: `a {
    $var1: 100px;
  }`,
      description: "never. $var inside a rule, emptyline after.",
      message: messages.rejected,
      line: 2,
      column: 5
    },
    {
      code: `
    $var1: 100px;

    // comment
  `,
      fixed: `
    $var1: 100px;
    // comment
  `,
      description: "never. $var in root, before comment, has empty line.",
      message: messages.rejected,
      line: 2,
      column: 5
    },
    {
      code: "a { $var1: 100px;\n\n}",
      fixed: "a { $var1: 100px;\n}",
      description: "never. Unix newline",
      message: messages.rejected,
      line: 1,
      column: 5
    },
    {
      code: "a { $var1: 100px;\r\n\r\n}",
      fixed: "a { $var1: 100px;\r\n}",
      description: "never. Windows newline",
      message: messages.rejected,
      line: 1,
      column: 5
    },
    {
      code: "a { $var1: 100px;\n\r\n}",
      fixed: "a { $var1: 100px;\r\n}",
      description: "never. Mixed newline",
      message: messages.rejected,
      line: 1,
      column: 5
    }
  ]
});

// Ignore: after-comment
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always", { ignore: "before-comment" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
    $var1: 100px;
    // comment
  `,
      description:
        "always, { ignore: before-comment }. $var before //-comment, no empty line."
    },
    {
      code: `
    $var1: 100px;

    // comment
  `,
      description:
        "always, { ignore: before-comment }. $var before //-comment, has empty line."
    },
    {
      code: `
    $var1: 100px;
    /* comment */
  `,
      description:
        "always, { ignore: before-comment }. $var before CSS-comment, no empty line."
    },
    {
      code: `
    $var1: 100px;
    /* comment */
  `,
      description:
        "always, { ignore: before-comment }. $var before CSS-comment, has empty line."
    }
  ],

  reject: [
    {
      code: `
    $var2: 2;
    width: 1;
  `,
      fixed: `
    $var2: 2;

    width: 1;
  `,
      description:
        "always, { ignore: before-comment }. No comment directly after $var, no empty line.",
      message: messages.expected,
      line: 2,
      column: 5
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { ignore: "before-comment" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
    $var1: 100px;
    // comment
  `,
      description:
        "never, { ignore: before-comment }. $var before //-comment, no empty line."
    },
    {
      code: `
    $var1: 100px;

    // comment
  `,
      description:
        "never, { ignore: before-comment }. $var before //-comment, has empty line."
    },
    {
      code: `
    $var1: 100px;
    /* comment */
  `,
      description:
        "never, { ignore: before-comment }. $var before CSS-comment, no empty line."
    },
    {
      code: `
    $var1: 100px;
    /* comment */
  `,
      description:
        "never, { ignore: before-comment }. $var before CSS-comment, has empty line."
    }
  ],

  reject: [
    {
      code: `
    $var2: 2;

    width: 1;
  `,
      fixed: `
    $var2: 2;
    width: 1;
  `,
      description:
        "never, { ignore: before-comment }. No comment directly before $var, has empty line.",
      message: messages.rejected,
      line: 2,
      column: 5
    }
  ]
});

// Ignore: single-line-block
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always", { ignore: "inside-single-line-block" }],
  syntax: "scss",

  accept: [
    {
      code: "a { $var1: 100px; }",
      description:
        "always, { ignore: inside-single-line-block }. $var inside single-line ruleset, alone."
    },
    {
      code: `
    a { $var1: 100px; }
  `,
      description:
        "always, { ignore: inside-single-line-block }. $var inside single-line ruleset with newlines around, alone."
    },
    {
      code: "a { width: 10px; $var1: 100px; color: red; }",
      description:
        "always, { ignore: inside-single-line-block }. $var inside single-line ruleset, has neighbours."
    }
  ],

  reject: [
    {
      code: `a {
    width: 1; $var2: 2;
  }`,
      description:
        "always, { ignore: inside-single-line-block }. Not a single line ruleset, $var and other decl on the same line.",
      message: messages.expected,
      line: 2,
      column: 15
    }
  ]
});

// Except: first-nested
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always", { except: "last-nested" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
    color: red;
    $var1: 100px;
  }`,
      description:
        "always, { except: last-nested }. $var is the last inside ruleset, no empty line."
    },
    {
      code: `@mixin name {
    color: red;
    $var1: 100px;
  }`,
      description:
        "always, { except: last-nested }. $var is the last inside mixin, no empty line."
    }
  ],

  reject: [
    {
      code: `a {
    $var2: 234; width: 1;
  }`,
      fixed: `a {
    $var2: 234;

width: 1;
  }`,
      description:
        "always, { except: last-nested }. $var is not the last in a ruleset, no empty line.",
      message: messages.expected,
      line: 2,
      column: 5
    },
    {
      code: `a {
    $var2: 2;

  }`,
      fixed: `a {
    $var2: 2;
  }`,
      description:
        "always, { except: last-nested }. $var is the last in a ruleset, has empty line.",
      message: messages.expected,
      line: 2,
      column: 5
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { except: "last-nested" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
    color: red;
    $var1: 100px;

  }`,
      description:
        "never, { except: last-nested }. $var is the last inside ruleset, has empty line."
    },
    {
      code: `a {
    $var1: 100px;
    color: red;
  }`,
      description:
        "never, { except: last-nested }. $var isn't the last inside ruleset, no empty line."
    }
  ],

  reject: [
    {
      code: `a {
    $var2: 2;
  }`,
      fixed: `a {
    $var2: 2;

  }`,
      description:
        "never, { except: last-nested }. $var is the last in a ruleset, no empty line.",
      message: messages.rejected,
      line: 2,
      column: 5
    },
    {
      code: `a {
    $var2: 2;

    color: red;
  }`,
      fixed: `a {
    $var2: 2;
    color: red;
  }`,
      description:
        "never, { except: last-nested }. $var isn't the last in a ruleset, has empty line.",
      message: messages.rejected,
      line: 2,
      column: 5
    }
  ]
});

// Except: first-nested with `disableFix: true`
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: [
    "always",
    {
      except: "last-nested",
      disableFix: true
    }
  ],
  syntax: "scss",
  unfixable: true,

  accept: [
    {
      code: `a {
    color: red;
    $var1: 100px;
  }`,
      description:
        "always, { except: last-nested }. $var is the last inside ruleset, no empty line."
    },
    {
      code: `@mixin name {
    color: red;
    $var1: 100px;
  }`,
      description:
        "always, { except: last-nested }. $var is the last inside mixin, no empty line."
    }
  ],

  reject: [
    {
      code: `a {
    $var2: 2; width: 1;
  }`,
      description:
        "always, { except: last-nested }. $var is not the last in a ruleset, no empty line.",
      message: messages.expected,
      line: 2,
      column: 5
    },
    {
      code: `a {
    $var2: 2;

  }`,
      description:
        "always, { except: last-nested }. $var is the last in a ruleset, has empty line.",
      message: messages.expected,
      line: 2,
      column: 5
    }
  ]
});

// Except: after-comment
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always", { except: "before-comment" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
    $var1: 100px;
    // comment
  `,
      description:
        "always, { except: before-comment }. $var before //-comment, no empty line."
    },
    {
      code: "$var1: 100px; /* comment */",
      description:
        "always, { except: before-comment }. $var before CSS-comment, no empty line."
    },
    {
      code: `
    $var1: 100px;

    @import 'a.css';
  `,
      description:
        "always, { except: before-comment }. $var is not before CSS-comment, has empty line."
    }
  ],

  reject: [
    {
      code: `
    $var1: 100px;

    // comment
  `,
      fixed: `
    $var1: 100px;
    // comment
  `,
      description:
        "always, { except: before-comment }. $var before //-comment, has empty line.",
      message: messages.expected,
      line: 2,
      column: 5
    },
    {
      code: `
    $var1: 100px;

    /* comment */
  `,
      fixed: `
    $var1: 100px;
    /* comment */
  `,
      description:
        "always, { except: before-comment }. $var before CSS-comment, has empty line.",
      message: messages.expected,
      line: 2,
      column: 5
    },
    {
      code: `a {
    $var1: 100px;
    color: red;
  }`,
      fixed: `a {
    $var1: 100px;

    color: red;
  }`,
      description:
        "always, { except: before-comment }. No comment after $var, has empty line.",
      message: messages.expected,
      line: 2,
      column: 5
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { except: "before-comment" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
    $var1: 100px;

    // comment
  `,
      description:
        "never, { except: before-comment }. $var before //-comment, has empty line."
    },
    {
      code: `
    $var1: 100px;

    /* comment */
  `,
      description:
        "never, { except: before-comment }. $var before CSS-comment, has empty line."
    },
    {
      code: `
    $var1: 100px;
    @import 'a.css';
  `,
      description:
        "never, { except: before-comment }. $var is not before CSS-comment, no empty line."
    }
  ],

  reject: [
    {
      code: `
    $var1: 100px;
    // comment
  `,
      fixed: `
    $var1: 100px;

    // comment
  `,
      description:
        "never, { except: before-comment }. $var before //-comment, no empty line.",
      message: messages.rejected,
      line: 2,
      column: 5
    },
    {
      code: `
    $var1: 100px;
    /* comment */
  `,
      fixed: `
    $var1: 100px;

    /* comment */
  `,
      description:
        "never, { except: before-comment }. $var before CSS-comment, no empty line.",
      message: messages.rejected,
      line: 2,
      column: 5
    },
    {
      code: `a {
    $var1: 100px;

    color: red;
  }`,
      fixed: `a {
    $var1: 100px;
    color: red;
  }`,
      description:
        "never, { except: before-comment }. No comment before $var, has empty line.",
      message: messages.rejected,
      line: 2,
      column: 5
    }
  ]
});

// Except: after-dollar-variable
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: ["always", { except: "before-dollar-variable" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
    $var1: 1;

  }`,
      description:
        "always, { except: before-dollar-variable }. Just a single var with empty line."
    },
    {
      code: `
    $var1: 1;
    $var2: 1;

  `,
      description:
        "always, { except: before-dollar-variable }. $var2 has empty line, $var1 before it doesn't."
    },
    {
      code: `
    $var1: 1;
    $var2: 1;
    $var3: 1;

  `,
      description:
        "always, { except: before-dollar-variable }. Three $var-s, last with empty line, others without."
    }
  ]
});

testRule({
  ruleName,
  config: ["never", { except: "before-dollar-variable" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `$var1: 1;

    $var2: 1;
  `,
      description:
        "never, { except: before-dollar-variable }. $var2 doesn't have empty line, $var2 before it does."
    },
    {
      code: `$var1: 1;

    $var2: 1;

    $var3: 1;
  `,
      description:
        "never, { except: before-dollar-variable }. Three $var-s, last w/o empty line, others with."
    }
  ],

  reject: [
    {
      code: `a {
    $var1: 1;
    $var2: 1;
  }`,
      fixed: `a {
    $var1: 1;

    $var2: 1;
  }`,
      description:
        "never, { except: before-dollar-variable }. $var1 and $var2 have no empty lines.",
      message: messages.rejected,
      line: 2,
      column: 5
    }
  ]
});

// Combining secondary options
// --------------------------------------------------------------------------

testRule({
  ruleName,
  config: [
    "always",
    { except: ["last-nested", "before-comment", "before-dollar-variable"] }
  ],
  syntax: "scss",

  accept: [
    {
      code: `
    a {
      $var1: value;
      $var2: value;

      $var3: value;
      /* comment */

      @extends "x";

      $var4: value;

      & b {
        prop: value;
      }

      $var5: value;
    }
  `,
      description:
        "always, { except: [last-nested, before-comment, before-dollar-variable] }."
    }
  ]
});
