import { messages, ruleName } from "..";

testRule({
  ruleName,
  config: ["always"],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @import "fff.scss";
    `,
      description: "Single file, .scss extension",
    },
    {
      code: `
      @import "path/fff.scss";
    `,
      description: "Single file, path with dir, .scss extension",
    },
    {
      code: `
      @import "df\\fff.scss";
    `,
      description:
        "Single file, path with dir, has extension, windows delimiters.",
    },
    {
      code: `
      @import 'fff.scss';
    `,
      description: "Single file, .scss extension, single quotes.",
    },
    {
      code: `
      @import "fff.foo";
    `,
      description: "Single file, .foo extension.",
    },
    {
      code: `
      @import " fff.scss1 ";
    `,
      description: "Single file, extension, trailing whitespaces.",
    },
    {
      code: `
      @import "fff.scss", "fff.moi";
    `,
      description: "Multiple files with extensions.",
    },
    {
      code: `
      @import url("path/_file.css");
    `,
      description: "Import CSS with url().",
    },
    {
      code: `
      @import "_file.css";
    `,
      description: "Import CSS by extension.",
    },
    {
      code: `
      @import "http://_file.scss";
    `,
      description: "Import CSS from the web, http://.",
    },
    {
      code: `
      @import " https://_file.scss ";
    `,
      description:
        "Import CSS from the web, https://, trailing spaces inside quotes",
    },
    {
      code: `
      @import 'https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap';
    `,
      description: "Import CSS from the web, https:// with comma",
    },
    {
      code: `
      @import "//_file.scss";
    `,
      description: "Import CSS from the web, no protocol.",
    },
    {
      code: `
      @import "_file.scss" screen;
    `,
      description: "Import CSS (with media queries).",
    },
    {
      code: `
      @import "_file.scss"screen;
    `,
      description: "Import CSS (with media queries).",
    },
    {
      code: `
      @import "_file.scss "screen;
    `,
      description:
        "Import CSS (with media queries), trailing space inside quotes.",
    },
    {
      code: `
      @import url(_lol.scss) screen;
    `,
      description: "Import CSS (with media queries - url + media).",
    },
    {
      code: `
      @import url('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap');
    `,
      description: "Import CSS from the web, https:// with comma",
    },
    {
      code: `
      @import _file.scss tv, screen;
    `,
      description: "Import CSS (with media queries - multiple).",
    },
    {
      code: `
      @import _file.scss tv,screen;
    `,
      description: "Import CSS (with media queries - multiple, no spaces).",
    },
    {
      code: `
      @import "screen.scss";
    `,
      description: "Import with a name that matches a media query type.",
    },
    {
      code: `
      @import "colors.variables.scss";
    `,
      description: "Import a filename with a dot.",
    },
  ],

  reject: [
    {
      code: `
      @import "fff";
    `,
      line: 2,
      column: 7,
      message: messages.expected,
      description: "Single file, no extension.",
    },
    {
      code: `
      @import "fff",
          "fff.ruthless";
    `,
      line: 2,
      column: 7,
      message: messages.expected,
      description: "Multiple files, one without extension.",
    },
    {
      code: `
      @import "fff", "score";
    `,
      warnings: [
        {
          line: 2,
          column: 7,
          message: messages.expected,
        },
        {
          line: 2,
          column: 7,
          message: messages.expected,
        },
      ],
      description: "Two files, no extensions.",
    },
  ],
});

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
      description: "Single file, no extension, double quotes.",
    },
    {
      code: `
      @import 'fff';
    `,
      description: "Single file, no extension, single quotes.",
    },
    {
      code: `
      @import ' fff ';
    `,
      description: "Single file, no extension, trailing spaces inside quotes.",
    },
    {
      code: `
      @import "fff", "score";
    `,
      description: "Two files, no extension, double quotes.",
    },
    {
      code: `
      @import "screen";
    `,
      description: "Import with a name that matches a media query type.",
    },
    {
      code: `
      @import url("path/_file.css");
    `,
      description: "Import CSS with url().",
    },
    {
      code: `
      @import "_file.css";
    `,
      description: "Import CSS by extension.",
    },
    {
      code: `
      @import "http://_file.scss";
    `,
      description: "Import CSS from the web, http://.",
    },
    {
      code: `
      @import " https://_file.scss ";
    `,
      description:
        "Import CSS from the web, https://, trailing spaces inside quotes",
    },
    {
      code: `
      @import 'https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap';
    `,
      description: "Import CSS from the web, https:// with comma",
    },
    {
      code: `
      @import "//_file.scss";
    `,
      description: "Import CSS from the web, no protocol.",
    },
    {
      code: `
      @import "_file.scss" screen;
    `,
      description: "Import CSS (with media queries).",
    },
    {
      code: `
      @import "_file.scss"screen;
    `,
      description: "Import CSS (with media queries).",
    },
    {
      code: `
      @import "_file.scss "screen;
    `,
      description:
        "Import CSS (with media queries), trailing space inside quotes.",
    },
    {
      code: `
      @import url(_lol.scss) screen;
    `,
      description: "Import CSS (with media queries - url + media).",
    },
    {
      code: `
      @import url('https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap');
    `,
      description: "Import CSS from the web, https:// with comma",
    },
    {
      code: `
      @import _file.scss tv, screen;
    `,
      description: "Import CSS (with media queries - multiple).",
    },
    {
      code: `
      @import _file.scss tv,screen;
    `,
      description: "Import CSS (with media queries - multiple, no spaces).",
    },
    {
      code: `
      @import "colors.variables";
    `,
      description: "Import a style file with a dot in the name.",
    },
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
      column: 20,
      message: messages.rejected("scss"),
      description: "Single file, .scss extension.",
    },
    {
      code: `
      @import "screen.scss";
    `,
      fixed: `
      @import "screen";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("scss"),
      description:
        "Single file with media query type as name, .scss extension.",
    },
    {
      code: `
      @import "fff.scss ";
    `,
      fixed: `
      @import "fff ";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("scss"),
      description: "Single file, has extension, space at the end.",
    },
    {
      code: `
      @import " fff.scss ";
    `,
      fixed: `
      @import " fff ";
    `,
      line: 2,
      column: 21,
      message: messages.rejected("scss"),
      description: "Single file, has extension, trailing spaces.",
    },
    {
      code: `
      @import "df/fff.scss";
    `,
      fixed: `
      @import "df/fff";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("scss"),
      description: "Single file, path with dir, has extension.",
    },
    {
      code: `
      @import "df\\fff.scss";
    `,
      fixed: `
      @import "df\\fff";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("scss"),
      description:
        "Single file, path with dir, has extension, windows delimiters.",
    },
    {
      code: `
      @import "df/fff", '_1.scss';
    `,
      fixed: `
      @import "df/fff", '_1';
    `,
      line: 2,
      column: 29,
      message: messages.rejected("scss"),
      description: "Two files, path with dir, has extension.",
    },
    {
      code: `
      @import "colors.variables.scss";
    `,
      fixed: `
      @import "colors.variables";
    `,
      line: 2,
      column: 33,
      message: messages.rejected("scss"),
      description: "Single file, has .scss extension and a dot in the name.",
    },
    {
      code: `
      @import "component.scss-theme.scss";
    `,
      fixed: `
      @import "component.scss-theme";
    `,
      line: 2,
      column: 26,
      message: messages.rejected("scss"),
      description:
        "Single file, has .scss extension and a .scss in the filename.",
    },
  ],
});
