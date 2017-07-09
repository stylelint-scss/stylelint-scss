import { findCommentsInRaws } from "../";
import postcss from "postcss";
import scss from "postcss-scss";
import test from "tape";

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

test("// is the first statement in the file", t => {
  t.plan(5);

  postcss()
    .process("// comment", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      t.equal(comments.length, 1);
      t.equal(comments[0].text, "comment");
      t.equal(comments[0].inlineAfter, false);
      t.equal(comments[0].inlineBefore, false);
      t.deepEqual(comments[0].source, { start: 0, end: 9 });
    })
    .catch(logError);
});

test("// is the first statement in a string, w/o pre-whs", t => {
  t.plan(5);

  postcss()
    .process(
      `a { width: 10; }
// comment`,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      t.equal(comments.length, 1);
      t.equal(comments[0].text, "comment");
      t.equal(comments[0].inlineAfter, false);
      t.equal(comments[0].inlineBefore, false);
      t.deepEqual(comments[0].source, { start: 17, end: 26 });
    })
    .catch(logError);
});

test("CSS-comment is the first statement (and the last one) in a file", t => {
  t.plan(5);

  postcss()
    .process("/* comment1 */", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      t.equal(comments.length, 1);
      t.equal(comments[0].text, "comment1");
      t.equal(comments[0].inlineAfter, false);
      t.equal(comments[0].inlineBefore, false);
      t.deepEqual(comments[0].source, { start: 0, end: 13 });
    })
    .catch(logError);
});

test("CSS-comment is the first statement (and the last one) in a string", t => {
  t.plan(5);

  postcss()
    .process(
      `
/* comment1 */
    `,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      t.equal(comments.length, 1);
      t.equal(comments[0].text, "comment1");
      t.equal(comments[0].inlineAfter, false);
      t.equal(comments[0].inlineBefore, false);
      t.deepEqual(comments[0].source, { start: 1, end: 14 });
    })
    .catch(logError);
});

test("Various.", t => {
  t.plan(13);

  postcss()
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
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      t.equal(comments.length, 3);
      t.equal(comments[0].text, "comment");
      t.equal(comments[0].raws.startToken, "/**!");
      t.equal(comments[0].raws.endToken, "*/");
      t.equal(comments[0].inlineAfter, false);
      t.deepEqual(comments[0].source, { start: 7, end: 21 });
      t.equal(comments[1].type, "double-slash");
      t.equal(comments[1].text, "there's a trailing whitespace at the end");
      t.deepEqual(comments[1].source, { start: 55, end: 98 });
      t.equal(comments[1].inlineAfter, true);
      t.equal(comments[2].inlineBefore, true);
      t.equal(comments[2].inlineAfter, true);
      // Here we take into account the fact that postcss-scss transforms
      // `// comment` -> `/* comment*/`, thus adding 2 symbols to the end
      t.deepEqual(comments[2].source, { start: 125, end: 139 });
    })
    .catch(logError);
});

test("//", t => {
  t.plan(4);

  postcss()
    .process(
      `
      //
    `,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      t.equal(comments.length, 1);
      t.equal(comments[0].text, "");
      t.equal(comments[0].inlineAfter, false);
      t.deepEqual(comments[0].source, { start: 7, end: 8 });
    })
    .catch(logError);
});

test("// Inline comment, after {.", t => {
  t.plan(3);

  postcss()
    .process(
      `
      a { // Inline comment, after {.
        width: 10px;
      }
    `,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      t.equal(comments.length, 1);
      t.equal(comments[0].text, "Inline comment, after {.");
      t.equal(comments[0].inlineAfter, true);
    })
    .catch(logError);
});

test("} // comment", t => {
  t.plan(2);

  postcss()
    .process(
      `
      a {} // comment
    `,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 1);
      t.equal(comments[0].inlineAfter, true);
    })
    .catch(logError);
});

test("Triple-slash comment", t => {
  t.plan(5);

  postcss()
    .process("a {} /// comment", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 1);
      t.equal(comments[0].text, "comment");
      t.equal(comments[0].raws.startToken, "///");
      t.equal(comments[0].inlineAfter, true);
      t.equal(comments[0].raws.left, " ");
    })
    .catch(logError);
});

test("Some fancy comment", t => {
  t.plan(5);

  postcss()
    .process(
      `
      /*!
       *  Font Awesome 4.6.3 by @davegandy - http://fontawesome.io - @fontawesome
       *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
       */
    `,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 1);
      t.equal(comments[0].raws.startToken, "/*!", "Start token");
      t.equal(comments[0].inlineAfter, false, "Inline after something");
      t.equal(
        comments[0].raws.left,
        `
       `,
        "Raws left."
      );
      t.deepEqual(comments[0].source, { start: 7, end: 189 });
    })
    .catch(logError);
});

test("Another fancy comment", t => {
  t.plan(5);

  postcss()
    .process(
      `
      /* Example with animate.css
      @import "animate.css/source/_base.css";
      "aaand if we try to close it here? */
    `,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 1);
      t.equal(comments[0].raws.startToken, "/*", "Start token");
      t.equal(comments[0].inlineAfter, false, "Inline after something");
      t.equal(comments[0].raws.left, " ", "Raws left.");
      t.equal(
        comments[0].text,
        'Example with animate.css\n      @import "animate.css/source/_base.css";\n      "aaand if we try to close it here?',
        "text"
      );
    })
    .catch(logError);
});

test("Comments inside comments", t => {
  t.plan(7);

  postcss()
    .process(
      `
      /* Text.. /* is that a new comment? */
      // And /* this */ ?
      /* And // this? */
    `,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 3);
      t.equal(comments[0].text, "Text.. /* is that a new comment?", "text 1");
      t.deepEqual(comments[0].source, { start: 7, end: 44 });
      t.equal(comments[1].text, "And /* this */ ?", "text 3");
      t.deepEqual(comments[1].source, { start: 52, end: 70 });
      t.equal(comments[2].text, "And // this?", "text 2");
      t.deepEqual(comments[2].source, { start: 80, end: 97 });
    })
    .catch(logError);
});

test("No comments, but parsing a selector with ().", t => {
  t.plan(1);

  postcss()
    .process(
      `
      .dropdown-menu:not(.level-0) {
        margin: 0;

        a {
          white-space: normal;
        }
      }
    `,
      { syntax: scss }
    )
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 0);
    })
    .catch(logError);
});

test("//-comment, Unix newlines", t => {
  t.plan(2);

  postcss()
    .process("\n   // comment \n", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 1);
      t.deepEqual(comments[0].source, { start: 4, end: 14 });
    })
    .catch(logError);
});

test("CSS comment, Unix newlines", t => {
  t.plan(2);

  postcss()
    .process("\n   /* part 1 \n part 2*/ \n", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 1);
      t.deepEqual(comments[0].source, { start: 4, end: 23 });
    })
    .catch(logError);
});

test("//-comment, Windows-newline", t => {
  t.plan(2);

  postcss()
    .process("\r\n   // comment \r\n", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 1);
      t.deepEqual(comments[0].source, { start: 5, end: 15 });
    })
    .catch(logError);
});

test("CSS comment, Windows newlines", t => {
  t.plan(2);

  postcss()
    .process("\r\n   /* part 1 \r\n part 2*/ \r\n", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);
      t.equal(comments.length, 1);
      t.deepEqual(comments[0].source, { start: 5, end: 25 });
    })
    .catch(logError);
});

test("No comments; testing a dangerous case in function detection [`@media( ... )`]", t => {
  t.plan(1);

  postcss()
    .process("@media(min-width: 480px) { }", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css;
      const comments = findCommentsInRaws(css);

      t.equal(comments.length, 0);
    })
    .catch(logError);
});
