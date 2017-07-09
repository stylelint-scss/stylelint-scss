import rule, { ruleName, messages } from "../";
import testRule from "stylelint-test-rule-tape";

import postcss from "postcss";
import test from "tape";

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

testRule(rule, {
  ruleName,
  config: [undefined],
  syntax: "scss",
  skipBasicChecks: true,

  accept: [
    {
      code: `
      a {
        background: no-repeat;
        margin: 1px;
      }
    `,
      description: "No groups."
    },
    {
      code: `
      a {
        background: url(img.png) center;
        background-repeat: no-repeat;
      }
    `,
      description: "No groups #2."
    },
    {
      code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background-repeat: no-repeat;
      }
    `,
      description: "One group, one unnested."
    },
    {
      code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background-color: red;
        background-repeat: no-repeat;
      }
    `,
      description: "One group, two unnested."
    },
    {
      code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background :red {
          repeat: no-repeat;
        }
      }
    `,
      description: "One group, one selector."
    },
    {
      code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        margin: 10px {
          left: 1px;
        }
      }
    `,
      description: "Multiple groups, different namespaces."
    },
    {
      code: `
      a {
        background: url(img.png) center {
          size: auto;
        }
        @media (color) {
          background: red {
            repeat: no-repeat;
          }
        }
      }
    `,
      description: "Two groups on one namespace, one nested in @media."
    },
    {
      code: `
      a {
        &:not(.other-class) { }
        &:not(.another-class) { }
      }
    `,
      description: "Two groups of &:not()."
    }
  ]
});

// Warnings

test("2 groups of the same namespace.", t => {
  t.plan(6);
  postcss([rule(undefined)])
    .process(
      `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background : red {
          repeat: no-repeat;
        }
      }
    `
    )
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 2, "Number of props reported");
      t.equal(warnings[0].text, messages.expected("background"), "Message");
      t.equal(warnings[0].line, 3, "Line number");
      t.equal(warnings[0].column, 9, "Column");
      t.equal(warnings[1].text, messages.expected("background"), "Message");
      t.equal(warnings[1].line, 6);
    })
    .catch(logError);
});

test("3 groups, 1 and 3 has the same namespace", t => {
  t.plan(5);
  postcss([rule(undefined)])
    .process(
      `
      a {
        background: url(img.png) center {
          size: auto;
        }
        margin: 10px {
          left: 1px;
        }
        
        background: linear-gradient(to bottom, red 0%, blue 10%) {
          position: center;
        }
      }
    `
    )
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 2, "Number of props reported");
      t.equal(
        warnings[0].text,
        messages.expected("background"),
        "Message (+prop name)"
      );
      t.equal(warnings[0].line, 3, "Line number");
      t.equal(warnings[1].line, 10);
      t.equal(
        warnings[1].text,
        messages.expected("background"),
        "Message (+prop name)"
      );
    })
    .catch(logError);
});

test("3 groups of the same namespace", t => {
  t.plan(6);
  postcss([rule(undefined)])
    .process(
      `
      a {
        background: url(img.png) center {
          size: auto;
        }
        background: red {
          repeat: no-repeat;
        }
        
        background: linear-gradient(to bottom, red 0%, blue 10%) {
          position: center;
        }
      }
    `
    )
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 3, "Number of props reported");
      t.equal(
        warnings[0].text,
        messages.expected("background"),
        "Message (+prop name)"
      );
      t.equal(warnings[0].line, 3, "Line number");
      t.equal(
        warnings[1].text,
        messages.expected("background"),
        "Message (+prop name)"
      );
      t.equal(warnings[1].line, 6);
      t.equal(warnings[2].line, 10);
    })
    .catch(logError);
});
