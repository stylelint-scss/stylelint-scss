"use strict";

const path = require("path");
const postcss = require("postcss");
const { rule } = require("..");

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

test("No file specified", done => {
  expect.assertions(2);

  postcss([rule()])
    .process("@import 'file.scss';", { from: undefined })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      expect(warnings[0].text).toBe(
        "The 'partial-no-import' rule won't work if linting in a code string without an actual file."
      );
      done();
    })
    .catch(logError);
});

test("Import a file from non-partial .scss", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Import a file from a partial .scss", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      done();
    });
});

test("Import a file from a partial .scss 2", done => {
  expect.assertions(1);
  postcss([rule()])
    .process('@import "file.scss";', {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      done();
    });
});

test("Ignores empty imports (Sass will throw an error instead)", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import '';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Ignores empty imports (Sass will throw an error instead) 2", done => {
  expect.assertions(1);
  postcss([rule()])
    .process('@import " ";', {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Import a file from a partial .scss; omitting extension", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      done();
    });
});

test("Import comma separated files from a partial .scss; omitting extension", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file','file2';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      done();
    });
});

test("Import comma separated files from a partial .scss; omitting extension 2", done => {
  expect.assertions(1);
  postcss([rule()])
    .process('@import "file" , "file2";', {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      done();
    });
});

// Exceptions
test("Import a file from CSS", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "_test.css")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Import a CSS from a partial .scss", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.css';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Import a CSS (url) from a partial .scss", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import url('file.scss');", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Import a CSS (with protocol) from a partial .scss", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import '//file.scss;'", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Import a CSS file (font URL with https) from a partial .scss", done => {
  expect.assertions(1);
  postcss([rule()])
    .process(
      "@import 'https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700';",
      {
        from: path.join(__dirname, "_test.scss")
      }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Import a local file and a CSS file (font URL with https) from a partial .scss (warn for local file, but not https import)", done => {
  expect.assertions(1);
  postcss([rule()])
    .process(
      "@import 'file', 'https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700';",
      {
        from: path.join(__dirname, "_test.scss")
      }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      done();
    });
});

test("Import a local file and a CSS file (font URL with https) from a partial .scss (warn for local file, but not https import) 2", done => {
  expect.assertions(1);
  postcss([rule()])
    .process(
      '@import "file", "https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700";',
      {
        from: path.join(__dirname, "_test.scss")
      }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      done();
    });
});

test("Import a local file and a CSS file (font URL with https) from a partial .scss (warn for local file, but not https import) 3", done => {
  expect.assertions(1);
  postcss([rule()])
    .process(
      '@import "https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700", "file";',
      {
        from: path.join(__dirname, "_test.scss")
      }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(1);
      done();
    });
});

test("Import a CSS (with media) from a partial .scss", done => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.scss' screen", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});

test("Multiple imports in a partial.", done => {
  expect.assertions(1);
  postcss([rule()])
    .process(
      '@import "_bootstrap/variables";\n@import "_font-awesome/variables";',
      {
        from: path.join(__dirname, "_variables.scss")
      }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(2);
      done();
    });
});

test("Import from a non-partial SCSS-file.", done => {
  expect.assertions(1);
  postcss([rule()])
    .process(
      '@import "bootstrap/variables";\n@import "font-awesome/variables";',
      {
        from: path.join(__dirname, "_der", "variables.scss")
      }
    )
    .then(result => {
      const warnings = result.warnings();

      expect(warnings).toHaveLength(0);
      done();
    });
});
