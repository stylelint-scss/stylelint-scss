"use strict";

const postcss = require("postcss");
const scss = require("postcss-scss");
const { findCommentsInRaws } = require("..");

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

test("// is the first statement in the file", () => {
  expect.assertions(5);

  return postcss()
    .process("// comment", { syntax: scss, from: undefined })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].text).toBe("comment");
      expect(comments[0].inlineAfter).toBe(false);
      expect(comments[0].inlineBefore).toBe(false);
      expect(comments[0].source).toEqual({ start: 0, end: 9 });
    })
    .catch(logError);
});

test("// is the first statement in a string, w/o pre-whs", () => {
  expect.assertions(5);

  return postcss()
    .process(
      `a { width: 10; }
// comment`,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].text).toBe("comment");
      expect(comments[0].inlineAfter).toBe(false);
      expect(comments[0].inlineBefore).toBe(false);
      expect(comments[0].source).toEqual({ start: 17, end: 26 });
    })
    .catch(logError);
});

test("CSS-comment is the first statement (and the last one) in a file", () => {
  expect.assertions(5);

  return postcss()
    .process("/* comment1 */", { syntax: scss, from: undefined })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].text).toBe("comment1");
      expect(comments[0].inlineAfter).toBe(false);
      expect(comments[0].inlineBefore).toBe(false);
      expect(comments[0].source).toEqual({ start: 0, end: 13 });
    })
    .catch(logError);
});

test("CSS-comment is the first statement (and the last one) in a string", () => {
  expect.assertions(5);

  return postcss()
    .process(
      `
/* comment1 */
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].text).toBe("comment1");
      expect(comments[0].inlineAfter).toBe(false);
      expect(comments[0].inlineBefore).toBe(false);
      expect(comments[0].source).toEqual({ start: 1, end: 14 });
    })
    .catch(logError);
});

test("Various.", () => {
  expect.assertions(13);

  return postcss()
    .process(
      `
      /**! comment */
      a
      {}
      
      b // there's a trailing whitespace at the end 
      {
        width: /* comment 3 */ 100px;
        background: url(http://lol);
        $var: "http://some-url";
        content: ' /* Haha, this 
          comment is ignored! */
          // this one too
        ';
      }
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(3);
      expect(comments[0].text).toBe("comment");
      expect(comments[0].raws.startToken).toBe("/**!");
      expect(comments[0].raws.endToken).toBe("*/");
      expect(comments[0].inlineAfter).toBe(false);
      expect(comments[0].source).toEqual({ start: 7, end: 21 });
      expect(comments[1].type).toBe("double-slash");
      expect(comments[1].text).toBe("there's a trailing whitespace at the end");
      expect(comments[1].source).toEqual({ start: 55, end: 98 });
      expect(comments[1].inlineAfter).toBe(true);
      expect(comments[2].inlineBefore).toBe(true);
      expect(comments[2].inlineAfter).toBe(true);
      // Here we take into account the fact that postcss-scss transforms
      // `// comment` -> `/* comment*/`, thus adding 2 symbols to the end
      expect(comments[2].source).toEqual({ start: 125, end: 139 });
    })
    .catch(logError);
});

test("//", () => {
  expect.assertions(4);

  return postcss()
    .process(
      `
      //
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].text).toBe("");
      expect(comments[0].inlineAfter).toBe(false);
      expect(comments[0].source).toEqual({ start: 7, end: 8 });
    })
    .catch(logError);
});

test("// Inline comment, after {.", () => {
  expect.assertions(3);

  return postcss()
    .process(
      `
      a { // Inline comment, after {.
        width: 10px;
      }
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].text).toBe("Inline comment, after {.");
      expect(comments[0].inlineAfter).toBe(true);
    })
    .catch(logError);
});

test("} // comment", () => {
  expect.assertions(2);

  return postcss()
    .process(
      `
      a {} // comment
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].inlineAfter).toBe(true);
    })
    .catch(logError);
});

test("Triple-slash comment", () => {
  expect.assertions(5);

  return postcss()
    .process("a {} /// comment", { syntax: scss, from: undefined })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].text).toBe("comment");
      expect(comments[0].raws.startToken).toBe("///");
      expect(comments[0].inlineAfter).toBe(true);
      expect(comments[0].raws.left).toBe(" ");
    })
    .catch(logError);
});

test("Some fancy comment", () => {
  expect.assertions(5);

  return postcss()
    .process(
      `
      /*!
       *  Font Awesome 4.6.3 by @davegandy - http://fontawesome.io - @fontawesome
       *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
       */
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].raws.startToken).toBe("/*!");
      expect(comments[0].inlineAfter).toBe(false);
      expect(comments[0].raws.left).toBe(
        `
       `
      );
      expect(comments[0].source).toEqual({ start: 7, end: 189 });
    })
    .catch(logError);
});

test("Another fancy comment", () => {
  expect.assertions(5);

  return postcss()
    .process(
      `
      /* Example with animate.css
      @import "animate.css/source/_base.css";
      "aaand if we try to close it here? */
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].raws.startToken).toBe("/*");
      expect(comments[0].inlineAfter).toBe(false);
      expect(comments[0].raws.left).toBe(" ");
      expect(comments[0].text).toBe(
        'Example with animate.css\n      @import "animate.css/source/_base.css";\n      "aaand if we try to close it here?'
      );
    })
    .catch(logError);
});

test("Comments inside comments", () => {
  expect.assertions(7);

  return postcss()
    .process(
      `
      /* Text.. /* is that a new comment? */
      // And /* this */ ?
      /* And // this? */
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(3);
      expect(comments[0].text).toBe("Text.. /* is that a new comment?");
      expect(comments[0].source).toEqual({ start: 7, end: 44 });
      expect(comments[1].text).toBe("And /* this */ ?");
      expect(comments[1].source).toEqual({ start: 52, end: 70 });
      expect(comments[2].text).toBe("And // this?");
      expect(comments[2].source).toEqual({ start: 80, end: 97 });
    })
    .catch(logError);
});

test("No comments, but parsing a selector with ().", () => {
  expect.assertions(1);

  return postcss()
    .process(
      `
      .dropdown-menu:not(.level-0) {
        margin: 0;

        a {
          white-space: normal;
        }
      }
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(0);
    })
    .catch(logError);
});

test("Double backslash inside a string (issue #294)", () => {
  expect.assertions(1);

  return postcss()
    .process(
      `
      $breadcrumbs-item-separator-item-rtl: '\\\\';
      $button-background: background('');
    `,
      { syntax: scss, from: undefined }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(0);
    })
    .catch(logError);
});

test("//-comment, Unix newlines", () => {
  expect.assertions(2);

  return postcss()
    .process("\n   // comment \n", { syntax: scss, from: undefined })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].source).toEqual({ start: 4, end: 14 });
    })
    .catch(logError);
});

test("CSS comment, Unix newlines", () => {
  expect.assertions(2);

  return postcss()
    .process("\n   /* part 1 \n part 2*/ \n", { syntax: scss, from: undefined })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].source).toEqual({ start: 4, end: 23 });
    })
    .catch(logError);
});

test("//-comment, Windows-newline", () => {
  expect.assertions(2);

  return postcss()
    .process("\r\n   // comment \r\n", { syntax: scss, from: undefined })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].source).toEqual({ start: 5, end: 15 });
    })
    .catch(logError);
});

test("CSS comment, Windows newlines", () => {
  expect.assertions(2);

  return postcss()
    .process("\r\n   /* part 1 \r\n part 2*/ \r\n", {
      syntax: scss,
      from: undefined
    })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(1);
      expect(comments[0].source).toEqual({ start: 5, end: 25 });
    })
    .catch(logError);
});

test("No comments; testing a dangerous case in function detection [`@media( ... )`]", () => {
  expect.assertions(1);

  return postcss()
    .process("@media(min-width: 480px) { }", { syntax: scss, from: undefined })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      expect(comments).toHaveLength(0);
    })
    .catch(logError);
});
