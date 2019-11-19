"use strict";

const { rule, ruleName, messages } = require("..");

// Testing single value
testRule(rule, {
  ruleName,
  config: ["scss"],
  syntax: "scss",

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
  ],

  reject: [
    {
      code: `
      @import "fff.scss";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("scss"),
      description: "One file, ext is blacklisted."
    },
    {
      code: `
      @import "fff.scss ";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("scss"),
      description: "One file, has extension, space at the end."
    },
    {
      code: `
      @import " fff.scss ";
    `,
      line: 2,
      column: 21,
      message: messages.rejected("scss"),
      description: "One file, has extension, trailing spaces."
    },
    {
      code: `
      @import "df/fff.scss";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("scss"),
      description: "One file, path with dir, has extension."
    },
    {
      code: `
      @import "df\\fff.scss";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("scss"),
      description: "One file, path with dir, has extension, windows delimiters."
    },
    {
      code: `
      @import "df/fff", '_1.scss';
    `,
      line: 2,
      column: 29,
      message: messages.rejected("scss"),
      description: "Two files, path with dir, has extension."
    }
  ]
});

// Testing an array
testRule(rule, {
  ruleName,
  config: [["scss", /less/]],
  syntax: "scss",

  accept: [
    {
      code: `
      @import "fff";
    `,
      description: "Single file, no extension."
    },
    {
      code: `
      @import "fff.foo";
    `,
      description: "Single file, extension not from a blacklist."
    },
    {
      code: `
      @import " fff.scss1 ";
    `,
      description:
        "Single file, extension not from a blacklist, trailing whitespaces."
    },
    {
      code: `
      @import "fff", "fff.moi";
    `,
      description: "Multiple files, ext not from a blacklist."
    }
  ],

  reject: [
    {
      code: `
      @import "fff.scss";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("scss"),
      description: "One file, ext from a blacklist array."
    },
    {
      code: `
      @import "fff.SCsS";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("SCsS"),
      description: "One file, ext from a blacklist array, messed case."
    },
    {
      code: `
      @import "fff.less";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("less"),
      description: "One file, ext from a blacklist array #2 (regex)."
    },
    {
      code: `
      @import "fff.LESS";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("LESS"),
      description:
        "One file, ext from a blacklist array #2 (regex), messed case."
    },
    {
      code: `
      @import "fff",
          "fff.ruthless";
    `,
      line: 3,
      column: 16,
      message: messages.rejected("ruthless"),
      description: "Multiple files, ext from a blacklist array."
    }
  ]
});
