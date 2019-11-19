"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

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
    }
  ],

  reject: [
    {
      code: `
      @import "_fff";
    `,
      line: 2,
      message: messages.expected,
      description: "One file, underscore at the start."
    },
    {
      code: `
      @import "_fff ";
    `,
      line: 2,
      message: messages.expected,
      description:
        "One file, underscore at the start, trailing space at the end."
    },
    {
      code: `
      @import " _fff";
    `,
      line: 2,
      message: messages.expected,
      description:
        "One file, underscore at the start, trailing space at the start."
    },
    {
      code: `
      @import "df/_fff";
    `,
      line: 2,
      message: messages.expected,
      description: "One file, path with dir, underscore at the start."
    },
    {
      code: `
      @import "df\\_fff";
    `,
      line: 2,
      message: messages.expected,
      description: "One file, path with dir, windows delimiters."
    },
    {
      code: `
      @import "df/fff", '_1.scss';
    `,
      line: 2,
      message: messages.expected,
      description: "Two files, path with dir, underscore at the start."
    }
  ]
});
