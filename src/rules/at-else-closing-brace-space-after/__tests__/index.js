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
      description: "always-intermediate (no @else at all)."
    },
    {
      code: `a {
      @if ($x == 1) { }
      @else { }
      width: 10px;
    }`,
      description:
        "always-intermediate (not an intermediate @else, newline after)."
    },
    {
      code: `a {
      @if ($x == 1) {} @else {}width: 10px;
    }`,
      description:
        "always-intermediate (not an intermediate @else, no whitespace after)."
    },
    {
      code: `a {
      @if ($x == 1) {} @else if ($x ==2) {

      } @else {}

      width: 10px;
    }`,
      description:
        "always-intermediate (an intermediate @else, has space after)."
    },
    {
      code: `a {
      @if ($x == 1) { } @else if ($x ==2) { } @else { }

      width: 10px;
    }`,
      description:
        "always-intermediate (an intermediate @else, single-line, has space after)."
    },
    {
      code: `a {
      @if ($x == 1) { } @else ($x ==2) {}@include x;
    }`,
      description:
        "always-intermediate (@else followed by non-@else at-rule, no space after)."
    },
    {
      code: "@if ($x == 1) {} @else ($x ==2) {}",
      description: "always-intermediate (single line, nothing after)."
    },
    {
      // TODO: should warn on this?
      code: `a {
      @if ($x == 1) { } @else ($x ==2) {

      } @include x;
    }`,
      description:
        "always-intermediate (followed by non-@else at-rule, has space after)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) { } @else ($x ==2) {

      }@else {}
    }`,
      fixed: `a {
      @if ($x == 1) { } @else ($x ==2) {

      } @else {}
    }`,
      description:
        "always-intermediate (an intermediate @else, no space after).",
      message: messages.expected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) { } @else ($x ==2) {

      }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) { } @else ($x ==2) {

      } @else { }
    }`,
      description:
        "always-intermediate (an intermediate @else, newline after).",
      message: messages.expected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) { } @else ($x ==2) {

      }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) { } @else ($x ==2) {

      } @else { }
    }`,
      description:
        "always-intermediate (an intermediate @else, a space and an newline after).",
      message: messages.expected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) { } @else ($x ==2) {

      }  @else { }
    }`,
      fixed: `a {
      @if ($x == 1) { } @else ($x ==2) {

      } @else { }
    }`,
      description:
        "always-intermediate (an intermediate @else, multiple spaces after).",
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
      @if ($x == 1) {} @else ($x ==2) {}
      width: 10px;
    }`,
      description:
        "never-intermediate (not an intermediate @else, has newline after)."
    },
    {
      code: `a {
      @if ($x == 1) {} @else ($x ==2) {}width: 10px;
    }`,
      description:
        "never-intermediate (not an intermediate @else, no whitespace after)."
    },
    {
      code: `a {
      @if ($x == 1) {} @else ($x ==2) {} width: 10px;
    }`,
      description:
        "never-intermediate (not an intermediate @else, has a space after)."
    },
    {
      code: `a {
      @if ($x == 1) {} @else ($x ==2) {

      }@else {}

      width: 10px;
    }`,
      description: "never-intermediate (an intermediate @else, no space after)."
    },
    {
      code: `a {
      @if ($x == 1) { }    @else ($x ==2) {}@else { }

      width: 10px;
    }`,
      description:
        "never-intermediate (an intermediate @else, single-line, no space after)."
    },
    {
      code: "@if ($x == 1) {} @else ($x ==2) {}",
      description: "never-intermediate (single line, nothing after)."
    },
    {
      // TODO: should warn on this?
      code: `a {
      @if ($x == 1) {

      } @else ($x ==2) {} @include x;
    }`,
      description:
        "never-intermediate (followed by non-@else at-rule, has space after)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) {} @else ($x ==2) {

      } @else {}
    }`,
      fixed: `a {
      @if ($x == 1) {} @else ($x ==2) {

      }@else {}
    }`,
      description:
        "never-intermediate (an intermediate @else, has space after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {} @else ($x ==2) {

      }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {} @else ($x ==2) {

      }@else { }
    }`,
      description: "never-intermediate (an intermediate @else, newline after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {} @else ($x ==2) {

      }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {} @else ($x ==2) {

      }@else { }
    }`,
      description:
        "never-intermediate (an intermediate @else, a space and a newline after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else ($x ==2) {}  @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else ($x ==2) {}@else { }
    }`,
      description:
        "never-intermediate (an intermediate @else, multiple spaces after).",
      message: messages.rejected,
      line: 4
    }
  ]
});
