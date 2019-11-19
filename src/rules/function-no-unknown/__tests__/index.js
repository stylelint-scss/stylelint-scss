"use strict";

const { ruleName, messages } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "a { color: hwb(240 100% 50%); }",
      description: "Normal CSS function"
    },
    {
      code: "a { color: hsl(240 100% 50%); }",
      description: "Function both in CSS and SCSS"
    },
    {
      code: "a { color: if(true, green, red); }",
      description: "SCSS function"
    },
    {
      code: "a { color: adjust-color(#6b717f, $red: 15); }"
    },
    {
      code: "a { color: color.adjust(#6b717f, $red: 15); }"
    },
    {
      code: `
      @use 'mymodule';

      .foobar {
        property: mymodule.myfunction();
      }
      `,
      description: "@use namespaced function. issue #760"
    },
    {
      code: `
      @use "mymodule";

      .foobar {
        property: mymodule.myfunction();
      }
      `,
      description: "@use namespaced function. issue #760"
    },
    {
      code: `
      @use "src/mymodule";

      .foobar {
        property: mymodule.myfunction();
      }
      `,
      description:
        "@use namespaced function (By default, the namespace is just the last component of the module's URL.) issue #760"
    },
    {
      code: `
      @use "src/mymodule" as m;

      .foobar {
        property: m.myfunction();
      }
      `,
      description: "@use namespaced function, 'as' keyword. issue #760"
    },
    {
      code: `
      @use 'library' with (
        $black: #222,
        $border-radius: 0.1rem
      );

      .foobar {
        property: library.fn();
      }
      `,
      description: "@use namespaced function, 'with' keyword. issue #760"
    },
    {
      code: `
      @use 'sass:math';

      $half: math.percentage(1/2);
      `,
      description: "@use built-in function."
    },
    {
      code: `
      @use 'sass:map';
      @use 'sass:string';

      $map-get: map.get(('key': 'value'), 'key');
      $str-index: string.index('string', 'i');
      `,
      description: "@use built-in function."
    }
  ],

  reject: [
    {
      code: "a { color: unknown(1); }",
      message: messages.rejected("unknown"),
      line: 1,
      column: 12
    },
    {
      code: "a { color: color.unknown(#6b717f, $red: 15); }",
      message: messages.rejected("color.unknown"),
      line: 1,
      column: 12
    },
    {
      code: `
      @use 'mymodule';

      .foobar {
        property: othermodule.myfunction();
      }
      `,
      message: messages.rejected("othermodule.myfunction"),
      line: 5,
      column: 19,
      description: "non-matching @use namespace"
    },
    {
      code: `
      @use "mymodule" as m;

      .foobar {
        property: c.myfunction();
      }
      `,
      message: messages.rejected("c.myfunction"),
      line: 5,
      column: 19,
      description: "non-matching @use namespace, 'as' keyword"
    },
    {
      code: `
      @use 'something' as *

      .class {
        color: myFn();
      }
      `,
      message: messages.rejected("myFn"),
      line: 5,
      column: 16,
      description: "@use without a namespace"
    }
  ]
});

testRule({
  ruleName,
  config: [true, { ignoreFunctions: ["/^my-/i", /foo$/, "bar"] }],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: "a { color: my-func(1); }"
    },
    {
      code: "a { color: MY-FUNC(1); }"
    },
    {
      code: "a { color: func-foo(1); }"
    },
    {
      code: "a { color: bar(1); }"
    }
  ],

  reject: [
    {
      code: "a { color: my(1); }",
      message: messages.rejected("my"),
      line: 1,
      column: 12
    },
    {
      code: "a { color: foo-func(1); }",
      message: messages.rejected("foo-func"),
      line: 1,
      column: 12
    },
    {
      code: "a { color: barrr(1); }",
      message: messages.rejected("barrr"),
      line: 1,
      column: 12
    }
  ]
});
