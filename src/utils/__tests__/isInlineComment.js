import { isInlineComment } from "../";
import postcss from "postcss";
import scss from "postcss-scss";
import test from "tape";

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

test("Single-line comment, after ruleset.", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a {} // comment
    `,
      { syntax: scss }
    )
    .then(result => {
      result.root.walkComments(comment => {
        t.equal(isInlineComment(comment), true);
      });
    })
    .catch(logError);
});

test("CSS comment, after ruleset.", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a {} /* comment */
    `,
      { syntax: scss }
    )
    .then(result => {
      result.root.walkComments(comment => {
        t.equal(isInlineComment(comment), true);
      });
    })
    .catch(logError);
});

test("Single-line comment, after a decl.", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a {
        width: 10px; // hmm
      }
    `,
      { syntax: scss }
    )
    .then(result => {
      result.root.walkComments(comment => {
        t.equal(isInlineComment(comment), true);
      });
    })
    .catch(logError);
});

test("CSS comment, before a decl.", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a {
        /* CSS comment, before a decl */ width: 10px;
      }
    `,
      { syntax: scss }
    )
    .then(result => {
      result.root.walkComments(comment => {
        t.equal(isInlineComment(comment), true);
      });
    })
    .catch(logError);
});

test("Inline comment, after a {.", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a { // Inline comment, after a {.
        width: 10px;
      }
    `,
      { syntax: scss }
    )
    .then(result => {
      result.root.walkComments(comment => {
        t.equal(isInlineComment(comment), true);
      });
    })
    .catch(logError);
});

test("Inline comment, after a selector (in a list). IGNORED.", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a, // comment
      b {
        width: 10px;
      }
    `,
      { syntax: scss }
    )
    .then(result => {
      let res = null;
      result.root.walkComments(comment => {
        res = isInlineComment(comment);
      });
      t.equal(res, null);
    })
    .catch(logError);
});

test("Inline comment, after a selector, comment prior. IGNORED.", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a,
      b {
        width: /* comment inside decl */ 10px;
      }
    `,
      { syntax: scss }
    )
    .then(result => {
      let res = null;
      result.root.walkComments(comment => {
        res = isInlineComment(comment);
      });
      t.equal(res, null);
    })
    .catch(logError);
});

test("Multi-line comment, after a ruleset (new line).", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a {}
      /* comment */
    `,
      { syntax: scss }
    )
    .then(result => {
      result.root.walkComments(comment => {
        t.equal(isInlineComment(comment), false);
      });
    })
    .catch(logError);
});

test("Single-line comment, after a ruleset (new line).", t => {
  t.plan(1);

  postcss()
    .process(
      `
      a {}
      // comment
    `,
      { syntax: scss }
    )
    .then(result => {
      result.root.walkComments(comment => {
        t.equal(isInlineComment(comment), false);
      });
    })
    .catch(logError);
});
