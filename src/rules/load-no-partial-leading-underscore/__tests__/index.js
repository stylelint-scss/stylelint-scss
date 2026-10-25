import rule from "../index.js";

const { ruleName, messages } = rule;

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @import "fff";
    `,
      description: "Single file, no underscore, double quotes."
    },
    {
      code: `
      @import 'fff';
    `,
      description: "Single file, no underscore, single quotes."
    },
    {
      code: `
      @import ' fff ';
    `,
      description: "Single file, no underscore, trailing spaces inside quotes."
    },
    {
      code: `
      @import "fff", "score";
    `,
      description: "Two files, no underscore, double quotes."
    },
    {
      code: `
      @import "ff_f";
    `,
      description: "One file, underscore in the middle."
    },
    {
      code: `
        @import "fff_",
        "score";
    `,
      description: "One file, underscore at the end."
    },
    {
      code: `
      @import "_path/fff";
    `,
      description:
        "One file, path with a dir, underscore in dir name, double quotes."
    },
    {
      code: `
      @import url("path/_file.css");
    `,
      description: "Import CSS with url()."
    },
    {
      code: `
      @import "_file.css";
    `,
      description: "Import CSS by extension."
    },
    {
      code: `
      @import "_file.css ";
    `,
      description: "Import CSS by extension, trailing spaces."
    },
    {
      code: `
      @import "http://_file.scss";
    `,
      description: "Import CSS from the web, http://."
    },
    {
      code: `
      @import " https://_file.scss ";
    `,
      description:
        "Import CSS from the web, https://, trailing spaces inside quotes"
    },
    {
      code: `
      @import "//_file.scss";
    `,
      description: "Import CSS from the web, no protocol."
    },
    {
      code: `
      @import "_file.scss" screen;
    `,
      description: "Import CSS (with media queries)."
    },
    {
      code: `
      @import "_file.scss"screen;
    `,
      description: "Import CSS (with media queries)."
    },
    {
      code: `
      @import "_file.scss "screen;
    `,
      description:
        "Import CSS (with media queries), trailing space inside quotes."
    },
    {
      code: `
      @import url(_lol.scss) screen;
    `,
      description: "Import CSS (with media queries - url + media)."
    },
    {
      code: `
      @import _file.scss tv, screen;
    `,
      description: "Import CSS (with media queries - multiple)."
    },
    {
      code: `
      @import _file.scss tv,screen;
    `,
      description: "Import CSS (with media queries - multiple, no spaces)."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css();
      }
    `,
      description: "meta.load-css, no parameters."
    },
    {
      code: `
      @use 'components/_' as my-components;
    `,
      description: "@use a bare underscore file, namespace with a hyphen."
    },
    {
      code: `
      @use 'components/_' as components;
    `,
      description: "@use a bare underscore file, namespace."
    },
    {
      code: `
      @use 'components/_' as *;
    `,
      description: "@use a bare underscore file, global namespace."
    },
    {
      code: `
      @use "fff" as alias;
    `,
      description: "@use one file, no underscore, namespace."
    },
    {
      code: `
      @use 'components/_' with ($primary: blue, $secondary: red);
    `,
      description: "@use a bare underscore file, configuration with commas."
    },
    {
      code: `
      @use 'components/_' as my-components with (
        $primary: blue,
        $secondary: red
      );
    `,
      description:
        "@use a bare underscore file, namespace and multiline configuration."
    },
    {
      code: `
      @forward 'components/_' as prefix-*;
    `,
      description: "@forward a bare underscore file, prefix."
    },
    {
      code: `
      @forward 'components/_' show my-mixin, $my-var;
    `,
      description: "@forward a bare underscore file, show list."
    },
    {
      code: `
      @forward 'components/_' hide my-mixin, $my-var;
    `,
      description: "@forward a bare underscore file, hide list."
    }
  ],

  reject: [
    {
      code: `
      @import "_fff";
    `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 20,
      message: messages.expected,
      description: "@import one file, underscore at the start."
    },
    {
      code: `
      @import "_fff ";
    `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 20,
      message: messages.expected,
      description:
        "@import one file, underscore at the start, trailing space at the end."
    },
    {
      code: `
      @import " _fff";
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 21,
      message: messages.expected,
      description:
        "@import one file, underscore at the start, trailing space at the start."
    },
    {
      code: `
      @import "df/_fff";
    `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 23,
      message: messages.expected,
      description: "@import one file, path with dir, underscore at the start."
    },
    {
      code: `
      @import "df\\_fff";
    `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 23,
      message: messages.expected,
      description: "@import one file, path with dir, windows delimiters."
    },
    {
      code: `
      @import "df/fff", '_1.scss';
    `,
      line: 2,
      column: 26,
      endLine: 2,
      endColumn: 33,
      message: messages.expected,
      description: "@import two files, path with dir, underscore at the start."
    },
    {
      code: `
      @use "_fff";
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 17,
      message: messages.expected,
      description: "@use one file, underscore at the start."
    },
    {
      code: `
      @use "_fff ";
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 17,
      message: messages.expected,
      description:
        "@use one file, underscore at the start, trailing space at the end."
    },
    {
      code: `
      @use " _fff";
    `,
      line: 2,
      column: 14,
      endLine: 2,
      endColumn: 18,
      message: messages.expected,
      description:
        "@use one file, underscore at the start, trailing space at the start."
    },
    {
      code: `
      @use "df/_fff";
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 20,
      message: messages.expected,
      description: "@use one file, path with dir, underscore at the start."
    },
    {
      code: `
      @use "df\\_fff";
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 20,
      message: messages.expected,
      description: "@use one file, path with dir, windows delimiters."
    },
    {
      code: `
      @use "df/fff", '_1.scss';
    `,
      line: 2,
      column: 23,
      endLine: 2,
      endColumn: 30,
      message: messages.expected,
      description: "@use two files, path with dir, underscore at the start."
    },
    {
      code: `
      @use '_foo' as bar;
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 17,
      message: messages.expected,
      description: "@use one file, underscore at the start, namespace."
    },
    {
      code: `
      @use '_foo' as my-alias;
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 17,
      message: messages.expected,
      description:
        "@use one file, underscore at the start, namespace with a hyphen."
    },
    {
      code: `
      @use '_foo' as *;
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 17,
      message: messages.expected,
      description: "@use one file, underscore at the start, global namespace."
    },
    {
      code: `
      @use 'df/_foo' with ($primary: blue, $secondary: red);
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 20,
      message: messages.expected,
      description:
        "@use one file, path with dir, underscore at the start, configuration with commas."
    },
    {
      code: `
      @forward "_fff";
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 21,
      message: messages.expected,
      description: "@forward one file, underscore at the start."
    },
    {
      code: `
      @forward "_fff ";
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 21,
      message: messages.expected,
      description:
        "@forward one file, underscore at the start, trailing space at the end."
    },
    {
      code: `
      @forward " _fff";
    `,
      line: 2,
      column: 18,
      endLine: 2,
      endColumn: 22,
      message: messages.expected,
      description:
        "@forward one file, underscore at the start, trailing space at the start."
    },
    {
      code: `
      @forward "df/_fff";
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 24,
      message: messages.expected,
      description: "@forward one file, path with dir, underscore at the start."
    },
    {
      code: `
      @forward "df\\_fff";
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 24,
      message: messages.expected,
      description: "@forward one file, path with dir, windows delimiters."
    },
    {
      code: `
      @forward "df/fff", '_1.scss';
    `,
      line: 2,
      column: 27,
      endLine: 2,
      endColumn: 34,
      message: messages.expected,
      description: "@forward two files, path with dir, underscore at the start."
    },
    {
      code: `
      @forward '_foo' as prefix-*;
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 21,
      message: messages.expected,
      description: "@forward one file, underscore at the start, prefix."
    },
    {
      code: `
      @forward '_foo' show bar, baz;
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 21,
      message: messages.expected,
      description: "@forward one file, underscore at the start, show list."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("df\\_fff", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 33,
      endLine: 4,
      endColumn: 40,
      message: messages.expected,
      description:
        "meta.load-css two params, path with dir, windows delimiters."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("_fff", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 33,
      endLine: 4,
      endColumn: 37,
      message: messages.expected,
      description:
        "meta.load-css two params, underscore at the start, trailing space at the start."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("_fff");
      }
    `,
      line: 4,
      column: 33,
      endLine: 4,
      endColumn: 37,
      message: messages.expected,
      description:
        "meta.load-css one param, underscore at the start, trailing space at the start."
    }
  ]
});
