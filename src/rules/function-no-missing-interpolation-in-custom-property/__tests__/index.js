import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      .a {
        --color: #{tokens.get("color.fg")};
      }
    `,
      description: "namespaced function inside interpolation"
    },
    {
      code: `
      .a {
        --size: #{math.div(16px, 2)};
      }
    `,
      description: "math.div inside interpolation"
    },
    {
      code: `
      .a {
        --size: #{ math.div(16px, 2) };
      }
    `,
      description: "interpolation with spaces"
    },
    {
      code: `
      .a {
        --shadow: #{lighten($base, 10%)};
      }
    `,
      description: "global Sass function inside interpolation"
    },
    {
      code: `
      .a {
        --size: calc(#{math.div(16px, 2)} + 1px);
      }
    `,
      description: "interpolated function inside a CSS function"
    },
    {
      code: `
      .a {
        --color: red;
        --size: 16px;
        --duration: var(--speed);
      }
    `,
      description: "plain CSS values"
    },
    {
      code: `
      .a {
        --color: rgb(0 0 0 / 50%);
        --size: calc(100% - 10px);
        --size-min: min(10px, 2vw);
        --filter: saturate(2) grayscale(1);
        --transform: translate(10px) scale(2);
      }
    `,
      description: "native CSS functions"
    },
    {
      code: `
      .a {
        --text: "math.div(16px, 2)";
      }
    `,
      description: "function call inside a string"
    },
    {
      code: `
      .a {
        width: math.div(16px, 2);
        color: lighten($base, 10%);
      }
    `,
      description: "Sass functions in regular properties"
    },
    {
      code: `
      .a {
        --value: unknown-function(1);
      }
    `,
      description: "unknown function that is not defined in the file"
    },
    {
      code: `
      @function double($n) {
        @return $n * 2;
      }

      .a {
        --size: #{double(2px)};
      }
    `,
      description: "interpolated local function"
    }
  ],

  reject: [
    {
      code: `
      .a {
        --color: tokens.get("color.fg");
      }
    `,
      fixed: `
      .a {
        --color: #{tokens.get("color.fg")};
      }
    `,
      message: messages.rejected("tokens.get", "--color"),
      line: 3,
      column: 18,
      endLine: 3,
      endColumn: 28,
      description: "namespaced function"
    },
    {
      code: `
      .a {
        --size: math.div(16px, 2);
      }
    `,
      fixed: `
      .a {
        --size: #{math.div(16px, 2)};
      }
    `,
      message: messages.rejected("math.div", "--size"),
      description: "math.div"
    },
    {
      code: `
      .a {
        --shadow: lighten($base, 10%);
      }
    `,
      fixed: `
      .a {
        --shadow: #{lighten($base, 10%)};
      }
    `,
      message: messages.rejected("lighten", "--shadow"),
      description: "global Sass function"
    },
    {
      code: `
      .a {
        --size: calc(math.div(16px, 2) + 1px);
      }
    `,
      fixed: `
      .a {
        --size: calc(#{math.div(16px, 2)} + 1px);
      }
    `,
      message: messages.rejected("math.div", "--size"),
      description: "Sass function inside a CSS function"
    },
    {
      code: `
      .a {
        --size: math.max(math.div(16px, 2), 4px);
      }
    `,
      fixed: `
      .a {
        --size: #{math.max(math.div(16px, 2), 4px)};
      }
    `,
      message: messages.rejected("math.max", "--size"),
      description: "only the outermost Sass function is reported"
    },
    {
      code: `
      .a {
        --value: math.div(16px, 2) map.get($map, key);
      }
    `,
      fixed: `
      .a {
        --value: #{math.div(16px, 2)} #{map.get($map, key)};
      }
    `,
      warnings: [
        { message: messages.rejected("math.div", "--value") },
        { message: messages.rejected("map.get", "--value") }
      ],
      description: "multiple Sass functions"
    },
    {
      code: `
      .a {
        --value: #{math.div(16px, 2)} map.get($map, key);
      }
    `,
      fixed: `
      .a {
        --value: #{math.div(16px, 2)} #{map.get($map, key)};
      }
    `,
      message: messages.rejected("map.get", "--value"),
      description: "Sass function after an interpolated one"
    },
    {
      code: `
      @function double($n) {
        @return $n * 2;
      }

      .a {
        --size: double(2px);
      }
    `,
      fixed: `
      @function double($n) {
        @return $n * 2;
      }

      .a {
        --size: #{double(2px)};
      }
    `,
      message: messages.rejected("double", "--size"),
      description: "function defined with @function in the file"
    },
    {
      code: `
      @function get-color($name) {
        @return $name;
      }

      .a {
        --color: get_color(primary);
      }
    `,
      fixed: `
      @function get-color($name) {
        @return $name;
      }

      .a {
        --color: #{get_color(primary)};
      }
    `,
      message: messages.rejected("get_color", "--color"),
      description: "local function called with underscores instead of hyphens"
    }
  ]
});
