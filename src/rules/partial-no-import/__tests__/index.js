import rule from "..";

import postcss from "postcss";
import path from "path";
import test from "tape";

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

test("No file specified", t => {
  t.plan(2);

  postcss([rule()])
    .process("@import 'file.scss';")
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 1, "Warning count");
      t.equal(
        warnings[0].text,
        "The 'partial-no-import' rule won't work if linting in a code string without an actual file.",
        "Warning message"
      );
    })
    .catch(logError);
});

test("Import a file from non-partial .scss", t => {
  t.plan(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 0, "No warning");
    });
});

test("Import a file from a partial .scss", t => {
  t.plan(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 1, "a warning");
    });
});

test("Import a file from a partial .scss; omitting extension", t => {
  t.plan(1);
  postcss([rule()])
    .process("@import 'file';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 1, "a warning");
    });
});

// Exceptions
test("Import a file from CSS", t => {
  t.plan(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "_test.css")
    })
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 0, "Skipping");
    });
});

test("Import a CSS from a partial .scss", t => {
  t.plan(1);
  postcss([rule()])
    .process("@import 'file.css';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 0, "Skipping");
    });
});

test("Import a CSS (url) from a partial .scss", t => {
  t.plan(1);
  postcss([rule()])
    .process("@import url('file.scss');", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 0, "Skipping");
    });
});

test("Import a CSS (with protocol) from a partial .scss", t => {
  t.plan(1);
  postcss([rule()])
    .process("@import //file.scss;", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 0, "Skipping");
    });
});

test("Import a CSS (with media) from a partial .scss", t => {
  t.plan(1);
  postcss([rule()])
    .process("@import file.scss screen", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 0, "Skipping");
    });
});

test("Multiple imports in a partial.", t => {
  t.plan(1);
  postcss([rule()])
    .process(
      '@import "_bootstrap/variables";\n@import "_font-awesome/variables";',
      {
        from: path.join(__dirname, "_variables.scss")
      }
    )
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 2, "Two warnings");
    });
});

test("Import from a non-partial SCSS-file.", t => {
  t.plan(1);
  postcss([rule()])
    .process(
      '@import "bootstrap/variables";\n@import "font-awesome/variables";',
      {
        from: path.join(__dirname, "_der", "variables.scss")
      }
    )
    .then(result => {
      const warnings = result.warnings();
      t.equal(warnings.length, 0, "No warnings");
    });
});
