import { findCommentsInRaws } from "../"
import postcss from "postcss"
import scss from "postcss-scss"
import test from "tape"

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}

test("Various.", t => {
  t.plan(13)

  postcss()
    .process(`
      /**! comment */
      a
      {}
      
      b // comment 2 
      {
        width: /* comment 3 */ 100px;
        background: url(http://lol);
      }
    `, { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css
      const comments = findCommentsInRaws(css)
      
      t.equal(comments.length, 3)
      t.equal(comments[0].text, "comment")
      t.equal(comments[0].raws.startToken, "/**!")
      t.equal(comments[0].raws.endToken, "*/")
      t.equal(comments[0].inlineAfter, false)
      t.equal(comments[1].type, "double-slash")
      t.equal(comments[1].text, "comment 2")
      t.equal(comments[1].start, 55)
      t.equal(comments[1].end, 67)
      t.equal(comments[1].inlineAfter, true)
      t.equal(comments[2].inlineBefore, true)
      t.equal(comments[2].inlineAfter, true)
      t.equal(comments[2].start, 92)
    })
    .catch(logError)
})

test("", t => {
  t.plan(3)

  postcss()
    .process(`
      a { // Inline comment, after {.
        width: 10px;
      }
    `, { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css
      const comments = findCommentsInRaws(css)
      
      t.equal(comments.length, 1)
      t.equal(comments[0].text, "Inline comment, after {.")
      t.equal(comments[0].inlineAfter, true)
    })
    .catch(logError)
})

test("", t => {
  t.plan(2)

  postcss()
    .process(`
      a {} // comment
    `, { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css
      const comments = findCommentsInRaws(css)
      t.equal(comments.length, 1)
      t.equal(comments[0].inlineAfter, true)
    })
    .catch(logError)
})

test("Triple-slash comment", t => {
  t.plan(5)

  postcss()
    .process("a {} /// comment", { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css
      const comments = findCommentsInRaws(css)
      t.equal(comments.length, 1)
      t.equal(comments[0].text, "comment")
      t.equal(comments[0].raws.startToken, "///")
      t.equal(comments[0].inlineAfter, true)
      t.equal(comments[0].raws.left, " ")
    })
    .catch(logError)
})

test("Some fancy comment", t => {
  t.plan(4)

  postcss()
    .process(`
      /*!
       *  Font Awesome 4.6.3 by @davegandy - http://fontawesome.io - @fontawesome
       *  License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
       */
    `, { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css
      const comments = findCommentsInRaws(css)
      t.equal(comments.length, 1)
      t.equal(comments[0].raws.startToken, "/*!", "Start token")
      t.equal(comments[0].inlineAfter, false, "Inline after something")
      t.equal(comments[0].raws.left, `
       `, "Raws left.")
    })
    .catch(logError)
})

test("Another fancy comment", t => {
  t.plan(5)

  postcss()
    .process(`
      /* Example with animate.css
      @import "animate.css/source/_base.css";
      "aaand if we try to close it here? */
    `, { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css
      const comments = findCommentsInRaws(css)
      t.equal(comments.length, 1)
      t.equal(comments[0].raws.startToken, "/*", "Start token")
      t.equal(comments[0].inlineAfter, false, "Inline after something")
      t.equal(comments[0].raws.left, " ", "Raws left.")
      t.equal(comments[0].text, "Example with animate.css\n      @import \"animate.css/source/_base.css\";\n      \"aaand if we try to close it here?", "text")
    })
    .catch(logError)
})

test("Another fancy comment", t => {
  t.plan(4)

  postcss()
    .process(`
      /* Text.. /* is that a new comment? */
      /* And // this? */
      // And /* this */ ?
    `, { syntax: scss })
    .then(result => {
      const css = result.root.source.input.css
      const comments = findCommentsInRaws(css)
      t.equal(comments.length, 3)
      t.equal(comments[0].text, "Text.. /* is that a new comment?", "text 1")
      t.equal(comments[1].text, "And // this?", "text 2")
      t.equal(comments[2].text, "And /* this */ ?", "text 3")
    })
    .catch(logError)
})
