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
      @import "fff.scss ";
    `,
      description: "One file, whitelisted extension, space at the end."
    },
    {
      code: `
      @import " fff.scss ";
    `,
      description: "One file, whitelisted extension, trailing spaces."
    },
    {
      code: `
      @import "df/fff.scss";
    `,
      description: "One file, path with dir, whitelisted extension."
    },
    {
      code: `
      @import "df\\fff.scss";
    `,
      description:
        "One file, path with dir, whitelisted extension, windows delimiters."
    },
    {
      code: `
      @import "df/fff", '_1.scss';
    `,
      description: "Two files, path with dir, whitelisted extension."
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
      description: "One file, ext not from a whitelist-string."
    },
    {
      code: `
      @import "fff.scssy ";
    `,
      line: 2,
      column: 20,
      message: messages.rejected("scssy"),
      description:
        "One file, ext not from a whitelist-string, space at the end."
    },
    {
      code: `
      @import " fff.less ";
    `,
      line: 2,
      column: 21,
      message: messages.rejected("less"),
      description: "One file, ext not from a whitelist-string, trailing spaces."
    },
    {
      code: `
      @import "df/fff.less";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("less"),
      description: "One file, path with dir, ext not from a whitelist-string."
    },
    {
      code: `
      @import "df\\fff.less";
    `,
      line: 2,
      column: 23,
      message: messages.rejected("less"),
      description:
        "One file, path with dir, ext not from a whitelist-string, windows delimiters."
    },
    {
      code: `
      @import "df/fff", '_1.less';
    `,
      line: 2,
      column: 29,
      message: messages.rejected("less"),
      description: "Two files, path with dir, ext not from a whitelist-string."
    }
  ]
});

// Testing exceptions
testRule(rule, {
  ruleName,
  config: ["scss"],
  syntax: "scss",

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
testRule(rule, {
  ruleName,
  config: [["scss", /less/]],
  syntax: "scss",

  accept: [
    {
      code: `
      @import "fff.scss";
    `,
      description: "One file, ext from a whitelist array (string)."
    },
    {
      code: `
      @import "fff.SCsS";
    `,
      description: "One file, ext from a whitelist array (string), messed case."
    },
    {
      code: `
      @import "fff.less";
    `,
      description: "One file, ext from a whitelist array (regex)."
    },
    {
      code: `
      @import "fff.LESS";
    `,
      description: "One file, ext from a whitelist array (regex), messed case."
    },
    {
      code: `
      @import "fff",
          "fff.ruthless";
    `,
      description:
        "Multiple files, ext from a whitelist array (regex), partial match."
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
      description: "Single file, extension not from a whitelist."
    },
    {
      code: `
      @import " fff.scss1 ";
    `,
      line: 2,
      column: 21,
      message: messages.rejected("scss1"),
      description:
        "Single file, extension not from a whitelist, trailing whitespaces."
    },
    {
      code: `
      @import "fff", "fff.moi";
    `,
      line: 2,
      column: 27,
      message: messages.rejected("moi"),
      description: "Multiple files, ext not from a whitelist."
    }
  ]
});
