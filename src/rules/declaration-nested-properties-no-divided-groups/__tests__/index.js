"use strict";

const { rule, ruleName, messages } = require("..");

const postcss = require("postcss");

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

test("2 groups of the same namespace.", () => {
  expect.assertions(6);

  return postcss([rule(undefined)])
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
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expected("background"));
      expect(warnings[0].line).toBe(3);
      expect(warnings[0].column).toBe(9);
      expect(warnings[1].text).toBe(messages.expected("background"));
      expect(warnings[1].line).toBe(6);
    })
    .catch(logError);
});

test("3 groups, 1 and 3 has the same namespace", () => {
  expect.assertions(5);

  return postcss([rule(undefined)])
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
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      expect(warnings[0].text).toBe(messages.expected("background"));
      expect(warnings[0].line).toBe(3);
      expect(warnings[1].line).toBe(10);
      expect(warnings[1].text).toBe(messages.expected("background"));
    })
    .catch(logError);
});

test("3 groups of the same namespace", () => {
  expect.assertions(6);

  return postcss([rule(undefined)])
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
    `,
      { from: undefined }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(3);
      expect(warnings[0].text).toBe(messages.expected("background"));
      expect(warnings[0].line).toBe(3);
      expect(warnings[1].text).toBe(messages.expected("background"));
      expect(warnings[1].line).toBe(6);
      expect(warnings[2].line).toBe(10);
    })
    .catch(logError);
});
