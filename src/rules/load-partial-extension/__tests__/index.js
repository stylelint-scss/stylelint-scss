import rule from "../index.js";

const { ruleName, messages } = rule;

// Always: Import
testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @import "fff.scss";
    `,
      description: "Single file, .scss extension"
    },
    {
      code: `
      @import "path/fff.scss";
    `,
      description: "Single file, path with dir, .scss extension"
    },
    {
      code: `
      @import "df\\fff.scss";
    `,
      description:
        "Single file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @import 'fff.scss';
    `,
      description: "Single file, .scss extension, single quotes."
    },
    {
      code: `
      @import "fff.foo";
    `,
      description: "Single file, .foo extension."
    },
    {
      code: `
      @import " fff.scss1 ";
    `,
      description: "Single file, extension, trailing whitespaces."
    },
    {
      code: `
      @import "fff.scss", "fff.moi";
    `,
      description: "Multiple files with extensions."
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
      @import 'https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap';
    `,
      description: "Import CSS from the web, https:// with comma"
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
      @import url('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap');
    `,
      description: "Import CSS from the web, https:// with comma"
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
      @import "screen.scss";
    `,
      description: "Import with a name that matches a media query type."
    },
    {
      code: `
      @import "colors.variables.scss";
    `,
      description: "Import a filename with a dot."
    }
  ],

  reject: [
    {
      code: `
      @import "fff";
    `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 19,
      message: messages.expected(),
      description: "Single file, no extension."
    },
    {
      code: `
      @import "fff",
          "fff.ruthless";
    `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 19,
      message: messages.expected(),
      description: "Multiple files, one without extension."
    },
    {
      code: `
      @import "fff", "score";
    `,
      warnings: [
        {
          line: 2,
          column: 16,
          endLine: 2,
          endColumn: 19,
          message: messages.expected()
        },
        {
          line: 2,
          column: 23,
          endLine: 2,
          endColumn: 28,
          message: messages.expected()
        }
      ],
      description: "Two files, no extensions."
    }
  ]
});

// Always : Use
testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @use "fff.scss";
    `,
      description: "Single file, .scss extension"
    },
    {
      code: `
      @use "path/fff.scss";
    `,
      description: "Single file, path with dir, .scss extension"
    },
    {
      code: `
      @use "df\\fff.scss";
    `,
      description:
        "Single file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @use 'fff.scss';
    `,
      description: "Single file, .scss extension, single quotes."
    },
    {
      code: `
      @use "fff.foo";
    `,
      description: "Single file, .foo extension."
    },
    {
      code: `
      @use " fff.scss1 ";
    `,
      description: "Single file, extension, trailing whitespaces."
    },
    {
      code: `
      @use url("path/_file.css");
    `,
      description: "use CSS with url()."
    },
    {
      code: `
      @use "_file.css";
    `,
      description: "use CSS by extension."
    },
    {
      code: `
      @use "http://_file.scss";
    `,
      description: "use CSS from the web, http://."
    },
    {
      code: `
      @use " https://_file.scss ";
    `,
      description:
        "use CSS from the web, https://, trailing spaces inside quotes"
    },
    {
      code: `
      @use url('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap');
    `,
      description: "use CSS from the web, https:// with comma"
    },
    {
      code: `
      @use "//_file.scss";
    `,
      description: "use CSS from the web, no protocol."
    },
    {
      code: `
      @use "colors.variables.scss";
    `,
      description: "use a filename with a dot."
    }
  ],

  reject: [
    {
      code: `
      @use "fff";
    `,
      line: 2,
      column: 13,
      endLine: 2,
      endColumn: 16,
      message: messages.expected("use"),
      description: "Single file, no extension."
    }
  ]
});

// Always : forward
testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @forward "fff.scss";
    `,
      description: "Single file, .scss extension"
    },
    {
      code: `
      @forward "path/fff.scss";
    `,
      description: "Single file, path with dir, .scss extension"
    },
    {
      code: `
      @forward "df\\fff.scss";
    `,
      description:
        "Single file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @forward 'fff.scss';
    `,
      description: "Single file, .scss extension, single quotes."
    },
    {
      code: `
      @forward "fff.foo";
    `,
      description: "Single file, .foo extension."
    },
    {
      code: `
      @forward " fff.scss1 ";
    `,
      description: "Single file, extension, trailing whitespaces."
    },
    {
      code: `
      @forward "http://_file.scss";
    `,
      description: "forward CSS from the web, http://."
    },
    {
      code: `
      @forward " https://_file.scss ";
    `,
      description:
        "forward CSS from the web, https://, trailing spaces inside quotes"
    },
    {
      code: `
      @forward "//_file.scss";
    `,
      description: "forward CSS from the web, no protocol."
    },
    {
      code: `
      @forward "colors.variables.scss";
    `,
      description: "forward a filename with a dot."
    }
  ],

  reject: [
    {
      code: `
      @forward "fff";
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 20,
      message: messages.expected("forward"),
      description: "Single file, no extension."
    },
    {
      code: `
      @forward "fff",
          "fff.ruthless";
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 20,
      message: messages.expected("forward"),
      description: "Multiple files, one without extension."
    },
    {
      code: `
      @forward "fff", "score";
    `,
      warnings: [
        {
          line: 2,
          column: 17,
          endLine: 2,
          endColumn: 20,
          message: messages.expected("forward")
        },
        {
          line: 2,
          column: 24,
          endLine: 2,
          endColumn: 29,
          message: messages.expected("forward")
        }
      ],
      description: "Two files, no extensions."
    }
  ]
});

// Always : meta.load-css
testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("fff.scss", $with: ("border-contrast": true));
      }
    `,
      description: "Single file, .scss extension"
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("paths/fff.scss", $with: ("border-contrast": true));
      }
    `,
      description: "Single file, path with dir, .scss extension"
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("df\\fff.scss", $with: ("border-contrast": true));
      }
    `,
      description:
        "Single file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css('fff.scss', $with: ("border-contrast": true));
      }
    `,
      description: "Single file, .scss extension, single quotes."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("fff.foo", $with: ("border-contrast": true));
      }
    `,
      description: "Single file, .foo extension."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css(" fff.scss1 ", $with: ("border-contrast": true));
      }
    `,
      description: "Single file, extension, trailing whitespaces."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("path/_file.css", $with: ("border-contrast": true));
      }
    `,
      description: "forward CSS with url()."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("_file.css", $with: ("border-contrast": true));
      }
    `,
      description: "forward CSS by extension."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("http://_file.scss", $with: ("border-contrast": true));
      }
    `,
      description: "forward CSS from the web, http://."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css(" https://_file.scss ", $with: ("border-contrast": true));
      }
    `,
      description:
        "forward CSS from the web, https://, trailing spaces inside quotes"
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("//_file.scss", $with: ("border-contrast": true));
      }
    `,
      description: "forward CSS from the web, no protocol."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css(url('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap'), $with: ("border-contrast": true));
      }
    `,
      description: "forward CSS from the web, https:// with comma"
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("colors.variables.scss", $with: ("border-contrast": true));
      }
    `,
      description: "forward a filename with a dot."
    },
    {
      code: `
      @include button-variant(primary);
    `,
      description: "Include a mixin without meta.load-css."
    }
  ],

  reject: [
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("fff", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 33,
      endLine: 4,
      endColumn: 36,
      message: messages.expected("meta.load-css"),
      description: "Single file, no extension."
    }
  ]
});

// Never: Import
testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @import "fff";
    `,
      description: "Single file, no extension, double quotes."
    },
    {
      code: `
      @import 'fff';
    `,
      description: "Single file, no extension, single quotes."
    },
    {
      code: `
      @import ' fff ';
    `,
      description: "Single file, no extension, trailing spaces inside quotes."
    },
    {
      code: `
      @import "fff", "score";
    `,
      description: "Two files, no extension, double quotes."
    },
    {
      code: `
      @import "screen";
    `,
      description: "Import with a name that matches a media query type."
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
      @import 'https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap';
    `,
      description: "Import CSS from the web, https:// with comma"
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
      @import url('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap');
    `,
      description: "Import CSS from the web, https:// with comma"
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
      @import "colors.variables";
    `,
      description: "Import a style file with a dot in the name."
    }
  ],

  reject: [
    {
      code: `
      @import "fff.scss";
     `,
      fixed: `
      @import "fff";
     `,
      line: 2,
      column: 19,
      endLine: 2,
      endColumn: 24,
      message: messages.rejected("scss"),
      description: "Single file, .scss extension."
    },
    {
      code: `
      @import "screen.scss";
    `,
      fixed: `
      @import "screen";
    `,
      line: 2,
      column: 22,
      endLine: 2,
      endColumn: 27,
      message: messages.rejected("scss", "import"),
      description: "Single file with media query type as name, .scss extension."
    },
    {
      code: `
      @import "fff.scss ";
    `,
      fixed: `
      @import "fff ";
    `,
      line: 2,
      column: 19,
      endLine: 2,
      endColumn: 24,
      message: messages.rejected("scss"),
      description: "Single file, has extension, space at the end."
    },
    {
      code: `
      @import " fff.scss ";
    `,
      fixed: `
      @import " fff ";
    `,
      line: 2,
      column: 20,
      endLine: 2,
      endColumn: 25,
      message: messages.rejected("scss"),
      description: "Single file, has extension, trailing spaces."
    },
    {
      code: `
      @import "df/fff.scss";
    `,
      fixed: `
      @import "df/fff";
    `,
      line: 2,
      column: 22,
      endLine: 2,
      endColumn: 27,
      message: messages.rejected("scss"),
      description: "Single file, path with dir, has extension."
    },
    {
      code: `
      @import "df\\fff.scss";
    `,
      fixed: `
      @import "df\\fff";
    `,
      line: 2,
      column: 22,
      endLine: 2,
      endColumn: 27,
      message: messages.rejected("scss"),
      description:
        "Single file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @import "df/fff", '_1.scss';
    `,
      fixed: `
      @import "df/fff", '_1';
    `,
      line: 2,
      column: 28,
      endLine: 2,
      endColumn: 33,
      message: messages.rejected("scss"),
      description: "Two files, path with dir, has extension."
    },
    {
      code: `
      @import "colors.variables.scss";
    `,
      fixed: `
      @import "colors.variables";
    `,
      line: 2,
      column: 32,
      endLine: 2,
      endColumn: 37,
      message: messages.rejected("scss"),
      description: "Single file, has .scss extension and a dot in the name."
    },
    {
      code: `
      @import "component.scss-theme.scss";
    `,
      fixed: `
      @import "component.scss-theme";
    `,
      line: 2,
      column: 36,
      endLine: 2,
      endColumn: 41,
      message: messages.rejected("scss"),
      description:
        "Single file, has .scss extension and a .scss in the filename."
    }
  ]
});

// Never: Use
testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @use "fff";
    `,
      description: "Single file, no extension, double quotes."
    },
    {
      code: `
      @use 'fff';
    `,
      description: "Single file, no extension, single quotes."
    },
    {
      code: `
      @use ' fff ';
    `,
      description: "Single file, no extension, trailing spaces inside quotes."
    },
    {
      code: `
      @use "_file.css";
    `,
      description: "use CSS by extension."
    },
    {
      code: `
      @use "http://_file.scss";
    `,
      description: "use CSS from the web, http://."
    },
    {
      code: `
      @use " https://_file.scss ";
    `,
      description:
        "use CSS from the web, https://, trailing spaces inside quotes"
    },
    {
      code: `
      @use 'https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap';
    `,
      description: "use CSS from the web, https:// with comma"
    },
    {
      code: `
      @use "//_file.scss";
    `,
      description: "use CSS from the web, no protocol."
    },
    {
      code: `
      @use url('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap');
    `,
      description: "use CSS from the web, https:// with comma"
    },
    {
      code: `
      @use "colors.variables";
    `,
      description: "use a style file with a dot in the name."
    }
  ],

  reject: [
    {
      code: `
      @use "fff.scss";
     `,
      fixed: `
      @use "fff";
     `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 21,
      message: messages.rejected("scss", "use"),
      description: "Single file, .scss extension."
    },
    {
      code: `
      @use "fff.scss";
     `,
      fixed: `
      @use "fff";
     `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 21,
      message: messages.rejected("scss", "use"),
      description: "Single file, .scss extension."
    },
    {
      code: `
      @use "fff.scss ";
    `,
      fixed: `
      @use "fff ";
    `,
      line: 2,
      column: 16,
      endLine: 2,
      endColumn: 21,
      message: messages.rejected("scss", "use"),
      description: "Single file, has extension, space at the end."
    },
    {
      code: `
      @use " fff.scss ";
    `,
      fixed: `
      @use " fff ";
    `,
      line: 2,
      column: 17,
      endLine: 2,
      endColumn: 22,
      message: messages.rejected("scss", "use"),
      description: "Single file, has extension, trailing spaces."
    },
    {
      code: `
      @use "df/fff.scss";
    `,
      fixed: `
      @use "df/fff";
    `,
      line: 2,
      column: 19,
      endLine: 2,
      endColumn: 24,
      message: messages.rejected("scss", "use"),
      description: "Single file, path with dir, has extension."
    },
    {
      code: `
      @use "df\\fff.scss";
    `,
      fixed: `
      @use "df\\fff";
    `,
      line: 2,
      column: 19,
      endLine: 2,
      endColumn: 24,
      message: messages.rejected("scss", "use"),
      description:
        "Single file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @use "df/fff", '_1.scss';
    `,
      fixed: `
      @use "df/fff", '_1';
    `,
      line: 2,
      column: 25,
      endLine: 2,
      endColumn: 30,
      message: messages.rejected("scss", "use"),
      description: "Two files, path with dir, has extension."
    },
    {
      code: `
      @use "colors.variables.scss";
    `,
      fixed: `
      @use "colors.variables";
    `,
      line: 2,
      column: 29,
      endLine: 2,
      endColumn: 34,
      message: messages.rejected("scss", "use"),
      description: "Single file, has .scss extension and a dot in the name."
    },
    {
      code: `
      @use "component.scss-theme.scss";
    `,
      fixed: `
      @use "component.scss-theme";
    `,
      line: 2,
      column: 33,
      endLine: 2,
      endColumn: 38,
      message: messages.rejected("scss", "use"),
      description:
        "Single file, has .scss extension and a .scss in the filename."
    }
  ]
});

// Never: forward
testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @forward "fff";
    `,
      description: "Single file, no extension, double quotes."
    },
    {
      code: `
      @forward 'fff';
    `,
      description: "Single file, no extension, single quotes."
    },
    {
      code: `
      @forward ' fff ';
    `,
      description: "Single file, no extension, trailing spaces inside quotes."
    },
    {
      code: `
      @forward "_file.css";
    `,
      description: "forward CSS by extension."
    },
    {
      code: `
      @forward "http://_file.scss";
    `,
      description: "forward CSS from the web, http://."
    },
    {
      code: `
      @forward " https://_file.scss ";
    `,
      description:
        "forward CSS from the web, https://, trailing spaces inside quotes"
    },
    {
      code: `
      @forward "//_file.scss";
    `,
      description: "forward CSS from the web, no protocol."
    },
    {
      code: `
      @forward "colors.variables";
    `,
      description: "forward a style file with a dot in the name."
    }
  ],

  reject: [
    {
      code: `
      @forward "fff.scss";
     `,
      fixed: `
      @forward "fff";
     `,
      line: 2,
      column: 20,
      endLine: 2,
      endColumn: 25,
      message: messages.rejected("scss", "forward"),
      description: "Single file, .scss extension."
    },
    {
      code: `
      @forward "fff.scss";
     `,
      fixed: `
      @forward "fff";
     `,
      line: 2,
      column: 20,
      endLine: 2,
      endColumn: 25,
      message: messages.rejected("scss", "forward"),
      description: "Single file, .scss extension."
    },
    {
      code: `
      @forward "fff.scss ";
    `,
      fixed: `
      @forward "fff ";
    `,
      line: 2,
      column: 20,
      endLine: 2,
      endColumn: 25,
      message: messages.rejected("scss", "forward"),
      description: "Single file, has extension, space at the end."
    },
    {
      code: `
      @forward " fff.scss ";
    `,
      fixed: `
      @forward " fff ";
    `,
      line: 2,
      column: 21,
      endLine: 2,
      endColumn: 26,
      message: messages.rejected("scss", "forward"),
      description: "Single file, has extension, trailing spaces."
    },
    {
      code: `
      @forward "df/fff.scss";
    `,
      fixed: `
      @forward "df/fff";
    `,
      line: 2,
      column: 23,
      endLine: 2,
      endColumn: 28,
      message: messages.rejected("scss", "forward"),
      description: "Single file, path with dir, has extension."
    },
    {
      code: `
      @forward "df\\fff.scss";
    `,
      fixed: `
      @forward "df\\fff";
    `,
      line: 2,
      column: 23,
      endLine: 2,
      endColumn: 28,
      message: messages.rejected("scss", "forward"),
      description:
        "Single file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @forward "colors.variables.scss";
    `,
      fixed: `
      @forward "colors.variables";
    `,
      line: 2,
      column: 33,
      endLine: 2,
      endColumn: 38,
      message: messages.rejected("scss", "forward"),
      description: "Single file, has .scss extension and a dot in the name."
    },
    {
      code: `
      @forward "component.scss-theme.scss";
    `,
      fixed: `
      @forward "component.scss-theme";
    `,
      line: 2,
      column: 37,
      endLine: 2,
      endColumn: 42,
      message: messages.rejected("scss", "forward"),
      description:
        "Single file, has .scss extension and a .scss in the filename."
    }
  ]
});

// Never: meta.load-css
testRule({
  ruleName,
  config: ["never"],
  customSyntax: "postcss-scss",
  fix: true,

  accept: [
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("fff", $with: ("border-contrast": true));
      }
    `,
      description: "Single file, no extension, double quotes."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css('fff', $with: ("border-contrast": true));
      }
    `,
      description: "Single file, no extension, single quotes."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css(' fff ', $with: ("border-contrast": true));
      }
    `,
      description: "Single file, no extension, trailing spaces inside quotes."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css(url("path/_file.css"), $with: ("border-contrast": true));
      }
    `,
      description: "meta.load-css CSS with url()."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("_file.css", $with: ("border-contrast": true));
      }
    `,
      description: "meta.load-css CSS by extension."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("http://_file.scss", $with: ("border-contrast": true));
      }
    `,
      description: "meta.load-css CSS from the web, http://."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css(" https://_file.scss ", $with: ("border-contrast": true));
      }
    `,
      description:
        "meta.load-css CSS from the web, https://, trailing spaces inside quotes"
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap', $with: ("border-contrast": true));
      }
    `,
      description: "meta.load-css CSS from the web, https:// with comma"
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("//_file.scss", $with: ("border-contrast": true));
      }
    `,
      description: "meta.load-css CSS from the web, no protocol."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css(url('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap'), $with: ("border-contrast": true));
      }
    `,
      description: "meta.load-css CSS from the web, https:// with comma"
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("colors.variables", $with: ("border-contrast": true));
      }
    `,
      description: "meta.load-css a style file with a dot in the name."
    },
    {
      code: `
      @include button-variant(primary);
    `,
      description: "Include a mixin without meta.load-css."
    }
  ],

  reject: [
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("fff.scss", $with: ("border-contrast": true));
      }
     `,
      fixed: `
      @use "sass:meta";
      .a {
        @include meta.load-css("fff", $with: ("border-contrast": true));
      }
     `,
      line: 4,
      column: 36,
      endLine: 4,
      endColumn: 41,
      message: messages.rejected("scss", "meta.load-css"),
      description: "Single file, .scss extension."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("fff.scss  ", $with: ("border-contrast": true));
      }
    `,
      fixed: `
      @use "sass:meta";
      .a {
        @include meta.load-css("fff  ", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 36,
      endLine: 4,
      endColumn: 41,
      message: messages.rejected("scss", "meta.load-css"),
      description: "Single file, has extension, space at the end."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css(" fff.scss ", $with: ("border-contrast": true));
      }
    `,
      fixed: `
      @use "sass:meta";
      .a {
        @include meta.load-css(" fff ", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 37,
      endLine: 4,
      endColumn: 42,
      message: messages.rejected("scss", "meta.load-css"),
      description: "Single file, has extension, trailing spaces."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("df/fff.scss", $with: ("border-contrast": true));
      }
    `,
      fixed: `
      @use "sass:meta";
      .a {
        @include meta.load-css("df/fff", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 39,
      endLine: 4,
      endColumn: 44,
      message: messages.rejected("scss", "meta.load-css"),
      description: "Single file, path with dir, has extension."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("df\\fff.scss", $with: ("border-contrast": true));
      }
    `,
      fixed: `
      @use "sass:meta";
      .a {
        @include meta.load-css("df\\fff", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 39,
      endLine: 4,
      endColumn: 44,
      message: messages.rejected("scss", "meta.load-css"),
      description:
        "Single file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("colors.variables.scss", $with: ("border-contrast": true));
      }
    `,
      fixed: `
      @use "sass:meta";
      .a {
        @include meta.load-css("colors.variables", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 49,
      endLine: 4,
      endColumn: 54,
      message: messages.rejected("scss", "meta.load-css"),
      description: "Single file, has .scss extension and a dot in the name."
    },
    {
      code: `
      @use "sass:meta";
      .a {
        @include meta.load-css("component.scss-theme.scss", $with: ("border-contrast": true));
      }
    `,
      fixed: `
      @use "sass:meta";
      .a {
        @include meta.load-css("component.scss-theme", $with: ("border-contrast": true));
      }
    `,
      line: 4,
      column: 53,
      endLine: 4,
      endColumn: 58,
      message: messages.rejected("scss", "meta.load-css"),
      description:
        "Single file, has .scss extension and a .scss in the filename."
    }
  ]
});
