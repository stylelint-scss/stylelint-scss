import rule from ".."
import postcss from "postcss"
import path from "path"
import test from "tape"

test("Import a file from non-partial .scss", t => {
  t.plan(1)
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "test.scss"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "No warning")
    })
})

test("Import a file from a partial .scss", t => {
  t.plan(1)
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "_test.scss"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 1, "a warning")
    })
})

test("Import a file from a partial .scss; omitting extension", t => {
  t.plan(1)
  postcss([rule()])
    .process("@import 'file';", {
      from: path.join(__dirname, "_test.scss"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 1, "a warning")
    })
})

// Exceptions
test("Import a file from CSS", t => {
  t.plan(1)
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "_test.css"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "Skipping")
    })
})

test("Import a CSS from a partial .scss", t => {
  t.plan(1)
  postcss([rule()])
    .process("@import 'file.css';", {
      from: path.join(__dirname, "_test.scss"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "Skipping")
    })
})

test("Import a CSS (url) from a partial .scss", t => {
  t.plan(1)
  postcss([rule()])
    .process("@import url('file.scss');", {
      from: path.join(__dirname, "_test.scss"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "Skipping")
    })
})

test("Import a CSS (with protocol) from a partial .scss", t => {
  t.plan(1)
  postcss([rule()])
    .process("@import //file.scss;", {
      from: path.join(__dirname, "_test.scss"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "Skipping")
    })
})

test("Import a CSS (with media) from a partial .scss", t => {
  t.plan(1)
  postcss([rule()])
    .process("@import file.scss screen", {
      from: path.join(__dirname, "_test.scss"),
    })
    .then(result => {
      const warnings = result.warnings()
      t.equal(warnings.length, 0, "Skipping")
    })
})
