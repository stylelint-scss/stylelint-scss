import * as path from "node:path";
import { fileURLToPath } from "node:url";
import rule from "../index.js";

const { ruleName, messages } = rule;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

testRule({
  ruleName,
  config: [true],

  accept: [
    {
      description: "Import a file from non-partial .scss",
      code: "@import 'file.scss';",
      codeFilename: path.join(__dirname, "test.scss")
    },
    {
      description: "Ignores empty imports (Sass will throw an error instead)",
      code: "@import '';",
      codeFilename: path.join(__dirname, "_test.scss")
    },
    {
      description: "Ignores empty imports (Sass will throw an error instead) 2",
      code: '@import " ";',
      codeFilename: path.join(__dirname, "_test.scss")
    },
    {
      description: "Import a file from CSS",
      code: "@import 'file.scss';",
      codeFilename: path.join(__dirname, "_test.css")
    },
    {
      description: "Import a CSS from a partial .scss",
      code: "@import 'file.css';",
      codeFilename: path.join(__dirname, "_test.scss")
    },
    {
      description: "Import a CSS (url) from a partial .scss",
      code: "@import url('file.css');",
      codeFilename: path.join(__dirname, "_test.scss")
    },
    {
      description: "Import a CSS (with protocol) from a partial .scss",
      code: "@import '//file.css';",
      codeFilename: path.join(__dirname, "_test.scss")
    },
    {
      description:
        "Import a CSS file (font URL with https) from a partial .scss",
      code: "@import 'https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700';",
      codeFilename: path.join(__dirname, "_test.scss")
    },
    {
      description: "Import a CSS (with media) from a partial .scss",
      code: "@import 'file.scss' screen",
      codeFilename: path.join(__dirname, "_test.scss")
    },
    {
      description: "Import from a non-partial SCSS-file.",
      code: '@import "bootstrap/variables";\n@import "font-awesome/variables";',
      codeFilename: path.join(__dirname, "_der", "variables.scss")
    }
  ],

  reject: [
    {
      description: "No file specified",
      code: "@import 'file.scss';",
      message: messages.expectedActualFile,
      line: 1,
      column: 2,
      endLine: 1,
      endColumn: 3
    },
    {
      description: "Import a file from a partial .scss",
      code: "@import 'file.scss';",
      codeFilename: path.join(__dirname, "_test.scss"),
      message: messages.expected,
      line: 1,
      column: 10,
      endLine: 1,
      endColumn: 19
    },
    {
      description: "Import a file from a partial .scss 2",
      code: '@import "file.scss";',
      codeFilename: path.join(__dirname, "_test.scss"),
      message: messages.expected,
      line: 1,
      column: 10,
      endLine: 1,
      endColumn: 19
    },
    {
      description: "Import a file from a partial .scss; omitting extension",
      code: "@import 'file';",
      codeFilename: path.join(__dirname, "_test.scss"),
      message: messages.expected,
      line: 1,
      column: 10,
      endLine: 1,
      endColumn: 14
    },
    {
      description:
        "Import comma separated files from a partial .scss; omitting extension",
      code: "@import 'file','file2';",
      codeFilename: path.join(__dirname, "_test.scss"),
      warnings: [
        {
          message: messages.expected,
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 14
        },
        {
          message: messages.expected,
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      description:
        "Import comma separated files from a partial .scss; omitting extension 2",
      code: '@import "file" , "file2";',
      codeFilename: path.join(__dirname, "_test.scss"),
      warnings: [
        {
          message: messages.expected,
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 14
        },
        {
          message: messages.expected,
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      description:
        "Import a local file and a CSS file (font URL with https) from a partial .scss (warn for local file, but not https import)",
      code: "@import 'file', 'https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700';",
      codeFilename: path.join(__dirname, "_test.scss"),
      message: messages.expected,
      line: 1,
      column: 10,
      endLine: 1,
      endColumn: 14
    },
    {
      description:
        "Import a local file and a CSS file (font URL with https) from a partial .scss (warn for local file, but not https import) 2",
      code: '@import "file", "https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700";',
      codeFilename: path.join(__dirname, "_test.scss"),
      message: messages.expected,
      line: 1,
      column: 10,
      endLine: 1,
      endColumn: 14
    },
    {
      description:
        "Import a local file and a CSS file (font URL with https) from a partial .scss (warn for local file, but not https import) 3",
      code: '@import "https://fonts.googleapis.com/css?family=Quicksand:300,400,500,700", "file";',
      codeFilename: path.join(__dirname, "_test.scss"),
      message: messages.expected,
      line: 1,
      column: 79,
      endLine: 1,
      endColumn: 83
    },
    {
      description: "Multiple imports from a partial .scss",
      code: '@import "_bootstrap/variables";\n@import "_font-awesome/variables";',
      codeFilename: path.join(__dirname, "_variables.scss"),
      warnings: [
        {
          message: messages.expected,
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 30
        },
        {
          message: messages.expected,
          line: 2,
          column: 10,
          endLine: 2,
          endColumn: 33
        }
      ]
    }
  ]
});
