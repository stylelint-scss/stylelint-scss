"use strict";

const { rule, ruleName, messages } = require("..");

// always
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {

      $var1: 100px;
    }`,
      description: "always. $var inside a rule, emptyline before."
    },
    {
      code: "$var1: 100px;",
      description: "always. $var in root, inside a rule, no emptyline before."
    },
    {
      code: `
      @import '1.css';


      $var1: 100px;
    `,
      description: "always. $var in root, not the 1st, multiple newlines."
    },
    {
      code: "a {\n\n$var1: 100px; }",
      description: "always. Unix newline"
    },
    {
      code: "a {\r\n\r\n$var1: 100px; }",
      description: "always. Windows newline"
    },
    {
      code: "a {\n\r\n$var1: 100px; }",
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
      description: "always. $var inside a rule, no emptyline before.",
      message: messages.expected,
      line: 2
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
      line: 3
    }
  ]
});

// never
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["never"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      $var1: 100px;
    }`,
      description: "never. $var inside a rule, no emptyline before."
    },
    {
      code: `

      $var1: 100px;
    `,
      description: "never. $var in root, the 1st, has newline."
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
      description: "never. $var inside a rule, emptyline before.",
      message: messages.rejected,
      line: 3
    },
    {
      code: `
      // comment

      $var1: 100px;
    `,
      fixed: `
      // comment
      $var1: 100px;
    `,
      description: "never. $var in root, after comment, has empty line.",
      message: messages.rejected,
      line: 4
    },
    {
      code: "a {\n\n$var1: 100px; }",
      fixed: "a {\n$var1: 100px; }",
      description: "never. Unix newline",
      message: messages.rejected,
      line: 3
    },
    {
      code: "a {\r\n\r\n$var1: 100px; }",
      fixed: "a {\r\n$var1: 100px; }",
      description: "never. Windows newline",
      message: messages.rejected,
      line: 3
    },
    {
      code: "a {\n\r\n$var1: 100px; }",
      fixed: "a {\r\n$var1: 100px; }",
      description: "never. Mixed newline",
      message: messages.rejected,
      line: 3
    }
  ]
});

// Ignore: after-comment
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always", { ignore: "after-comment" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
      // comment
      $var1: 100px;
    `,
      description:
        "always, { ignore: after-comment }. $var after //-comment, no empty line."
    },
    {
      code: `
      // comment

      $var1: 100px;
    `,
      description:
        "always, { ignore: after-comment }. $var after //-comment, has empty line."
    },
    {
      code: `
      /* comment */
      $var1: 100px;
    `,
      description:
        "always, { ignore: after-comment }. $var after CSS-comment, no empty line."
    },
    {
      code: `
      /* comment */
      $var1: 100px;
    `,
      description:
        "always, { ignore: after-comment }. $var after CSS-comment, has empty line."
    }
  ],

  reject: [
    {
      code: `
      width: 1;
      $var2: 2;
    `,
      fixed: `
      width: 1;

      $var2: 2;
    `,
      description:
        "always, { ignore: after-comment }. No comment directly before $var, no empty line.",
      message: messages.expected,
      line: 3
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never", { ignore: "after-comment" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
      // comment
      $var1: 100px;
    `,
      description:
        "never, { ignore: after-comment }. $var after //-comment, no empty line."
    },
    {
      code: `
      // comment

      $var1: 100px;
    `,
      description:
        "never, { ignore: after-comment }. $var after //-comment, has empty line."
    },
    {
      code: `
      /* comment */
      $var1: 100px;
    `,
      description:
        "never, { ignore: after-comment }. $var after CSS-comment, no empty line."
    },
    {
      code: `
      /* comment */
      $var1: 100px;
    `,
      description:
        "never, { ignore: after-comment }. $var after CSS-comment, has empty line."
    }
  ],

  reject: [
    {
      code: `
      width: 1;

      $var2: 2;
    `,
      fixed: `
      width: 1;
      $var2: 2;
    `,
      description:
        "never, { ignore: after-comment }. No comment directly before $var, has empty line.",
      message: messages.rejected,
      line: 4
    }
  ]
});

// Ignore: single-line-block
// --------------------------------------------------------------------------

testRule(rule, {
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
      line: 2
    },
    {
      code: "@include name; $var2: 2",
      description:
        "always, { ignore: inside-single-line-block }. In root, $var and a mixin call on the same line.",
      message: messages.expected,
      line: 1
    }
  ]
});

// Except: first-nested
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always", { except: "first-nested" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      $var1: 100px;
      color: red;
    }`,
      description:
        "always, { except: first-nested }. $var is the 1st inside ruleset, no empty line."
    },
    {
      code: `@mixin name {
      $var1: 100px;
      color: red;
    }`,
      description:
        "always, { except: first-nested }. $var is the 1st inside mixin, no empty line."
    }
  ],

  reject: [
    {
      code: `a {
      width: 1; $var2: 2;
    }`,
      fixed: `a {
      width: 1;

$var2: 2;
    }`,
      description:
        "always, { except: first-nested }. $var is not the 1st in a ruleset, no epmty line.",
      message: messages.expected,
      line: 2
    },
    {
      code: `a {

      $var2: 2;
    }`,
      fixed: `a {
      $var2: 2;
    }`,
      description:
        "always, { except: first-nested }. $var is the 1st in a ruleset, has epmty line.",
      message: messages.rejected,
      line: 3
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never", { except: "first-nested" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {

      $var1: 100px;
      color: red;
    }`,
      description:
        "never, { except: first-nested }. $var is the 1st inside ruleset, has empty line."
    },
    {
      code: `a {
      color: red;
      $var1: 100px;
    }`,
      description:
        "never, { except: first-nested }. $var isn't the 1st inside ruleset, no empty line."
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
        "never, { except: first-nested }. $var is the 1st in a ruleset, no epmty line.",
      message: messages.expected,
      line: 2
    },
    {
      code: `a {
      color: red;

      $var2: 2;
    }`,
      fixed: `a {
      color: red;
      $var2: 2;
    }`,
      description:
        "never, { except: first-nested }. $var isn't the 1st in a ruleset, has epmty line.",
      message: messages.rejected,
      line: 4
    }
  ]
});

// Except: first-nested with `disableFix: true`
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: [
    "always",
    {
      except: "first-nested",
      disableFix: true
    }
  ],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      $var1: 100px;
      color: red;
    }`,
      description:
        "always, { except: first-nested }. $var is the 1st inside ruleset, no empty line."
    },
    {
      code: `@mixin name {
      $var1: 100px;
      color: red;
    }`,
      description:
        "always, { except: first-nested }. $var is the 1st inside mixin, no empty line."
    }
  ],

  reject: [
    {
      code: `a {
      width: 1; $var2: 2;
    }`,
      fixed: `a {
      width: 1; $var2: 2;
    }`,
      description:
        "always, { except: first-nested }. $var is not the 1st in a ruleset, no epmty line.",
      message: messages.expected,
      line: 2
    },
    {
      code: `a {

      $var2: 2;
    }`,
      fixed: `a {

      $var2: 2;
    }`,
      description:
        "always, { except: first-nested }. $var is the 1st in a ruleset, has epmty line.",
      message: messages.rejected,
      line: 3
    }
  ]
});

// Except: after-comment
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always", { except: "after-comment" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
      // comment
      $var1: 100px;
    `,
      description:
        "always, { except: after-comment }. $var after //-comment, no empty line."
    },
    {
      code: "/* comment */  $var1: 100px;",
      description:
        "always, { except: after-comment }. $var after CSS-comment, no empty line."
    },
    {
      code: `
      @import 'a.css';

      $var1: 100px;
    `,
      description:
        "always, { except: after-comment }. $var is not after CSS-comment, has empty line."
    }
  ],

  reject: [
    {
      code: `
      // comment

      $var1: 100px;
    `,
      fixed: `
      // comment
      $var1: 100px;
    `,
      description:
        "always, { except: after-comment }. $var after //-comment, has empty line.",
      message: messages.rejected,
      line: 4
    },
    {
      code: `
      /* comment */

      $var1: 100px;
    `,
      fixed: `
      /* comment */
      $var1: 100px;
    `,
      description:
        "always, { except: after-comment }. $var after CSS-comment, has empty line.",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      color: red;
      $var1: 100px;
    }`,
      fixed: `a {
      color: red;

      $var1: 100px;
    }`,
      description:
        "always, { except: after-comment }. No comment before $var, has empty line.",
      message: messages.expected,
      line: 3
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never", { except: "after-comment" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `
      // comment

      $var1: 100px;
    `,
      description:
        "never, { except: after-comment }. $var after //-comment, has empty line."
    },
    {
      code: `
      /* comment */

      $var1: 100px;
    `,
      description:
        "never, { except: after-comment }. $var after CSS-comment, has empty line."
    },
    {
      code: `
      @import 'a.css';
      $var1: 100px;
    `,
      description:
        "never, { except: after-comment }. $var is not after CSS-comment, no empty line."
    }
  ],

  reject: [
    {
      code: `
      // comment
      $var1: 100px;
    `,
      fixed: `
      // comment

      $var1: 100px;
    `,
      description:
        "never, { except: after-comment }. $var after //-comment, no empty line.",
      message: messages.expected,
      line: 3
    },
    {
      code: `
      /* comment */
      $var1: 100px;
    `,
      fixed: `
      /* comment */

      $var1: 100px;
    `,
      description:
        "never, { except: after-comment }. $var after CSS-comment, no empty line.",
      message: messages.expected,
      line: 3
    },
    {
      code: `a {
      color: red;

      $var1: 100px;
    }`,
      fixed: `a {
      color: red;
      $var1: 100px;
    }`,
      description:
        "never, { except: after-comment }. No comment before $var, has empty line.",
      message: messages.rejecteds,
      line: 4
    }
  ]
});

// Except: after-dollar-variable
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: ["always", { except: "after-dollar-variable" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {

      $var1: 1;
    }`,
      description:
        "always, { except: after-dollar-variable }. Just a single var with empty line."
    },
    {
      code: `

      $var1: 1;
      $var2: 1;
    `,
      description:
        "always, { except: after-dollar-variable }. $var1 has empty line, $var2 after it doesn't."
    },
    {
      code: `

      $var1: 1;
      $var2: 1;
      $var3: 1;
    `,
      description:
        "always, { except: after-dollar-variable }. Three $var-s, 1st with empty line, others without."
    }
  ],

  reject: [
    {
      code: `
      $var1: 1;

      $var2: 1;
    `,
      fixed: `
      $var1: 1;
      $var2: 1;
    `,
      description:
        "always, { except: after-dollar-variable }. $var1 and $var2 have empty lines.",
      message: messages.rejected,
      line: 4
    }
  ]
});

testRule(rule, {
  ruleName,
  config: ["never", { except: "after-dollar-variable" }],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `$var1: 1;

      $var2: 1;
    `,
      description:
        "never, { except: after-dollar-variable }. $var1 doesn't have empty line, $var2 after it does."
    },
    {
      code: `$var1: 1;

      $var2: 1;

      $var3: 1;
    `,
      description:
        "never, { except: after-dollar-variable }. Three $var-s, 1st w/o empty line, others with."
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
        "never, { except: after-dollar-variable }. $var1 and $var2 have empty lines.",
      message: messages.expected,
      line: 3
    }
  ]
});

// Combining secondary options
// --------------------------------------------------------------------------

testRule(rule, {
  ruleName,
  config: [
    "always",
    { except: ["first-nested", "after-comment", "after-dollar-variable"] }
  ],
  syntax: "scss",

  accept: [
    {
      code: `
      a {
        $var1: value;
        $var2: value;

        /* comment */
        $var3: value;

        @extends "x";

        $var4: value;

        & b {
          prop: value;
        }

        $var5: value;
      }
    `,
      description:
        "always, { except: [first-nested, after-comment, after-declaration] }."
    }
  ]
});
