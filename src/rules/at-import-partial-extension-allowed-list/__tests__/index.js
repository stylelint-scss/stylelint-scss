"use strict";

const { messages, ruleName } = require("..");

// Testing single value
testRule({
  ruleName,
  config: ["scss"],
  customSyntax: "postcss-scss",

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
      @import "fff.scss ";
    `,
      description: "One file, allow-listed extension, space at the end."
    },
    {
      code: `
      @import " fff.scss ";
    `,
      description: "One file, allow-listed extension, trailing spaces."
    },
    {
      code: `
      @import "df/fff.scss";
    `,
      description: "One file, path with dir, allow-listed extension."
    },
    {
      code: `
      @import "df\\fff.scss";
    `,
      description:
        "One file, path with dir, allow-listed extension, windows delimiters."
    },
    {
      code: `
      @import "df/fff", '_1.scss';
    `,
      description: "Two files, path with dir, allow-listed extension."
    }
  ],

  reject: [
    {
      code: `
      @import "fff.less";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("less"),
      description: "One file, ext not from an allowed list."
    },
    {
      code: `
      @import "fff.scssy ";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("scssy"),
      description:
        "One file, ext not from an allowed list, space at the end."
    },
    {
      code: `
      @import " fff.less ";
    `,
      line: 2,
      column: 21,
      message: messages.rejected("less"),
      description: "One file, ext not from an allowed list, trailing spaces."
    },
    {
      code: `
      @import "df/fff.less";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("less"),
      description: "One file, path with dir, ext not from an allowed list."
    },
    {
      code: `
      @import "df\\fff.less";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("less"),
      description:
        "One file, path with dir, ext not from an allowed list, windows delimiters."
    },
    {
      code: `
      @import "df/fff", '_1.less';
    `,
      line: 2,
      column: 29,
      message: messages.rejected("less"),
      description: "Two files, path with dir, ext not from an allowed list."
    }
  ]
});

// Testing exceptions
testRule({
  ruleName,
  config: ["scss"],
  customSyntax: "postcss-scss",

  accept: [
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
    }
  ]
});

// Testing an array
testRule({
  ruleName,
  config: [["scss", /less/]],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      @import "fff.scss";
    `,
      description: "One file, ext from a allowed list (string)."
    },
    {
      code: `
      @import "fff.SCsS";
    `,
      description: "One file, ext from a allowed list (string), messed case."
    },
    {
      code: `
      @import "fff.less";
    `,
      description: "One file, ext from a allowed list (regex)."
    },
    {
      code: `
      @import "fff.LESS";
    `,
      description: "One file, ext from a allowlist (regex), messed case."
    },
    {
      code: `
      @import "fff",
          "fff.ruthless";
    `,
      description:
        "Multiple files, ext from a allowlist (regex), partial match."
    }
  ],

  reject: [
    {
      code: `
      @import "fff.foo";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("foo"),
      description: "Single file, extension not from a allowed list."
    },
    {
      code: `
      @import " fff.scss1 ";
    `,
      line: 2,
      column: 21,
      message: messages.rejected("scss1"),
      description:
        "Single file, extension not from a allowed list, trailing whitespaces."
    },
    {
      code: `
      @import "fff", "fff.moi";
    `,
      line: 2,
      column: 27,
      message: messages.rejected("moi"),
      description: "Multiple files, ext not from a allowed list."
    }
  ]
});
