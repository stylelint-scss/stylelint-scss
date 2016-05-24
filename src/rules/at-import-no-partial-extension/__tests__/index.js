import testRule from "stylelint-test-rule-tape"
import rule, { ruleName, messages } from ".."

// Testing main value
testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [ {
    code: `
      @import "fff";
    `,
    description: "Single file, no extension, double quotes.",
  }, {
    code: `
      @import 'fff';
    `,
    description: "Single file, no extension, single quotes.",
  }, {
    code: `
      @import ' fff ';
    `,
    description: "Single file, no extension, trailing spaces inside quotes.",
  }, {
    code: `
      @import "fff", "score";
    `,
    description: "Two files, no extension, double quotes.",
  }, {
    code: `
      @import url("path/_file.css");
    `,
    description: "Import CSS with url().",
  }, {
    code: `
      @import "_file.css";
    `,
    description: "Import CSS by extension.",
  }, {
    code: `
      @import "http://_file.scss";
    `,
    description: "Import CSS from the web, http://.",
  }, {
    code: `
      @import " https://_file.scss ";
    `,
    description: "Import CSS from the web, https://, trailing spaces inside quotes",
  }, {
    code: `
      @import "//_file.scss";
    `,
    description: "Import CSS from the web, no protocol.",
  }, {
    code: `
      @import "_file.scss" screen;
    `,
    description: "Import CSS (with media queries).",
  }, {
    code: `
      @import "_file.scss"screen;
    `,
    description: "Import CSS (with media queries).",
  }, {
    code: `
      @import "_file.scss "screen;
    `,
    description: "Import CSS (with media queries), trailing space inside quotes.",
  }, {
    code: `
      @import url(_lol.scss) screen;
    `,
    description: "Import CSS (with media queries - url + media).",
  }, {
    code: `
      @import _file.scss tv, screen;
    `,
    description: "Import CSS (with media queries - multiple).",
  }, {
    code: `
      @import _file.scss tv,screen;
    `,
    description: "Import CSS (with media queries - multiple, no spaces).",
  } ],

  reject: [ {
    code: `
      @import "fff.less";
    `,
    line: 2,
    message: messages.expected,
    description: "One file, has extension.",
  }, {
    code: `
      @import "fff.less ";
    `,
    line: 2,
    message: messages.expected,
    description: "One file, has extension, space at the end.",
  }, {
    code: `
      @import " fff.less ";
    `,
    line: 2,
    message: messages.expected,
    description: "One file, has extension, trailing spaces.",
  }, {
    code: `
      @import "df/fff.scss";
    `,
    line: 2,
    message: messages.expected,
    description: "One file, path with dir, has extension.",
  }, {
    code: `
      @import "df\\fff.scss";
    `,
    line: 2,
    message: messages.expected,
    description: "One file, path with dir, has extension, windows delimiters.",
  }, {
    code: `
      @import "df/fff", '_1.scss';
    `,
    line: 2,
    message: messages.expected,
    description: "Two files, path with dir, has extension.",
  } ],
})

// Testing ignoring string
testRule(rule, {
  ruleName,
  config: [ true, { ignoreExtensions: [ "scss", "less" ] } ],
  syntax: "scss",

  accept: [ {
    code: `
      @import "fff";
    `,
    description: "Single file, no extension.",
  }, {
    code: `
      @import "fff.scss";
    `,
    description: "Single file, extension string-ignored.",
  }, {
    code: `
      @import " fff.scss ";
    `,
    description: "Single file, extension string-ignored, trailing whitespaces.",
  }, {
    code: `
      @import "fff", "fff.scss";
    `,
    description: "Multiple files, one of the extensions string-ignored.",
  } ],

  reject: [{
    code: `
      @import "fff.scss1";
    `,
    line: 2,
    message: messages.expected,
    description: "One file, ignored extension differs from an actual.",
  }],
})

// Testing regex
testRule(rule, {
  ruleName,
  config: [ true, { ignoreExtensions: [ "less", /^scss/ ] } ],
  syntax: "scss",

  accept: [ {
    code: `
      @import "fff";
    `,
    description: "Single file, no extension.",
  }, {
    code: `
      @import "fff", "fff.scss";
    `,
    description: "Multiple files, one with a regex-ignored extension.",
  }, {
    code: `
      @import "fff", " fff.scss ";
    `,
    description: "Multiple files, one with a regex-ignored extension and trailing spaces.",
  }, {
    code: `
      @import "fff.scss", 'fils.less';
    `,
    description: "Multiple files with extensions, one with a regex-ignored extension, the other with a string-ignored one.",
  }, {
    code: `
      @import "fff.scss1";
    `,
    line: 2,
    message: messages.expected,
    description: "One file, starts with the ignored pattern.",
  } ],

  reject: [{
    code: `
      @import "fff.1scss";
    `,
    line: 2,
    message: messages.expected,
    description: "One file, extension differs from the pattern.",
  }],
})
