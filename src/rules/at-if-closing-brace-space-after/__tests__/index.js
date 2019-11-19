"use strict";

const { rule, ruleName, messages } = require("..");

// always-intermediate
testRule(rule, {
  ruleName,
  config: ["always-intermediate"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      @if ($x == 1) {}
      width: 10px;
    }`,
      description: "always-intermediate (no @else, has newline after)."
    },
    {
      code: `a {
      @if ($x == 1) {}width: 10px;
    }`,
      description: "always-intermediate (no @else, no whitespace after)."
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else {}

      width: 10px;
    }`,
      description: "always-intermediate (has @else, has space after)."
    },
    {
      code: `a {
      @if ($x == 1) { } @else { }

      width: 10px;
    }`,
      description:
        "always-intermediate (has @else, single-line, has space after)."
    },
    {
      code: `a {
      @if ($x == 1) { }@include x;
    }`,
      description:
        "always-intermediate (followed by non-@else at-rule, no space after)."
    },
    {
      code: "@if ($x == 1) {}",
      description: "always-intermediate (single line, nothing after)."
    },
    {
      // TODO: should warn on this?
      code: `a {
      @if ($x == 1) {

      } @include x;
    }`,
      description:
        "always-intermediate (followed by non-@else at-rule, has space after)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) {

      }@else {}
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else {}
    }`,
      description: "always-intermediate (has @else, no space after).",
      message: messages.expected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else { }
    }`,
      description: "always-intermediate (has @else, newline after).",
      message: messages.expected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else { }
    }`,
      description:
        "always-intermediate (has @else, a space and an newline after).",
      message: messages.expected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      }  @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else { }
    }`,
      description: "always-intermediate (has @else, multiple spaces after).",
      message: messages.expected,
      line: 4
    }
  ]
});

// never-intermediate
testRule(rule, {
  ruleName,
  config: ["never-intermediate"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      @if ($x == 1) {}
      width: 10px;
    }`,
      description: "never-intermediate (no @else, has newline after)."
    },
    {
      code: `a {
      @if ($x == 1) {}width: 10px;
    }`,
      description: "never-intermediate (no @else, no whitespace after)."
    },
    {
      code: `a {
      @if ($x == 1) {} width: 10px;
    }`,
      description: "never-intermediate (no @else, has a space after)."
    },
    {
      code: `a {
      @if ($x == 1) {

      }@else {}

      width: 10px;
    }`,
      description: "never-intermediate (has @else, no space after)."
    },
    {
      code: `a {
      @if ($x == 1) { }@else { }

      width: 10px;
    }`,
      description:
        "never-intermediate (has @else, single-line, no space after)."
    },
    {
      code: "@if ($x == 1) {}",
      description: "never-intermediate (single line, nothing after)."
    },
    {
      // TODO: should warn on this?
      code: `a {
      @if ($x == 1) {

      } @include x;
    }`,
      description:
        "never-intermediate (followed by non-@else at-rule, has space after)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) {

      } @else {}
    }`,
      fixed: `a {
      @if ($x == 1) {

      }@else {}
    }`,
      description: "never-intermediate (has @else, has space after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      }@else { }
    }`,
      description: "never-intermediate (has @else, newline after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      }@else { }
    }`,
      description:
        "never-intermediate (has @else, a space and a newline after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      }  @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      }@else { }
    }`,
      description: "never-intermediate (has @else, multiple spaces after).",
      message: messages.rejected,
      line: 4
    }
  ]
});
