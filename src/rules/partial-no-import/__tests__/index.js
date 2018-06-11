import rule from "..";

import postcss from "postcss";
import path from "path";

function logError(err) {
  console.log(err.stack); // eslint-disable-line no-console
}

test("No file specified", () => {
  expect.assertions(2);

  postcss([rule()])
    .process("@import 'file.scss';", { from: undefined })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(1);
      expect(warnings[0].text).toBe(
        "The 'partial-no-import' rule won't work if linting in a code string without an actual file."
      );
    })
    .catch(logError);
});

test("Import a file from non-partial .scss", () => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(0);
    });
});

test("Import a file from a partial .scss", () => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(1);
    });
});

test("Import a file from a partial .scss; omitting extension", () => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(1);
    });
});

// Exceptions
test("Import a file from CSS", () => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.scss';", {
      from: path.join(__dirname, "_test.css")
    })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(0);
    });
});

test("Import a CSS from a partial .scss", () => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import 'file.css';", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(0);
    });
});

test("Import a CSS (url) from a partial .scss", () => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import url('file.scss');", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(0);
    });
});

test("Import a CSS (with protocol) from a partial .scss", () => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import //file.scss;", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(0);
    });
});

test("Import a CSS (with media) from a partial .scss", () => {
  expect.assertions(1);
  postcss([rule()])
    .process("@import file.scss screen", {
      from: path.join(__dirname, "_test.scss")
    })
    .then(result => {
      const warnings = result.warnings();
      expect(warnings.length).toBe(0);
    });
});

test("Multiple imports in a partial.", () => {
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
      expect(warnings.length).toBe(2);
    });
});

test("Import from a non-partial SCSS-file.", () => {
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
      expect(warnings.length).toBe(0);
    });
});
