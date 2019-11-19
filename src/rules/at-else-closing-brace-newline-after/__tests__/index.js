"use strict";

const { rule, ruleName, messages } = require("..");

testRule(rule, {
  ruleName,
  config: ["always-last-in-chain"],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      @if ($x == 1) {} @else {}
      width: 10px;
    }`,
      description:
        "always-last-in-chain (no following @else, has newline after)."
    },
    {
      code: `a {
      @if ($x == 1) {} @else {}

      width: 10px;
    }`,
      description:
        "always-last-in-chain (no following @else, has blank line after)."
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else if {

      } @else {}

      width: 10px;
    }`,
      description:
        "always-last-in-chain (has following @else, this one with no newline after, the following has it)."
    },
    {
      code: `a {
      @if ($x == 1) { } @else if { } @else { }

      width: 10px;
    }`,
      description:
        "always-last-in-chain (has following @else, single-line, this one with no newline after, the following has it)."
    },
    {
      code: `a {
      @if ($x == 1) { } @else { }

      @include x;
    }`,
      description:
        "always-last-in-chain (followed by non-@else at-rule, single-line, empty line after)."
    },
    {
      code: "@if ($x == 1) {} @else { }",
      description: "always-last-in-chain (single line, nothing after)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) {

      } @else {

      } width: 10px;
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else {

      }
width: 10px;
    }`,
      description:
        "always-last-in-chain (has decl on the same line as its closing brace).",
      message: messages.expected,
      line: 6
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else if { }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else if { } @else { }
    }`,
      description: "always-last-in-chain (has following @else, newline after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else { }

      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else { } @else { }
    }`,
      description:
        "always-last-in-chain (has following @else, empty line after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else {} @include x;
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else {}
@include x;
    }`,
      description:
        "always-last-in-chain (followed by non-@else at-rule, no newline after).",
      message: messages.expected,
      line: 4
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    "always-last-in-chain",
    {
      disableFix: true
    }
  ],
  syntax: "scss",
  fix: true,

  accept: [
    {
      code: `a {
      @if ($x == 1) {} @else {}
      width: 10px;
    }`,
      description:
        "always-last-in-chain (no following @else, has newline after)."
    },
    {
      code: `a {
      @if ($x == 1) {} @else {}

      width: 10px;
    }`,
      description:
        "always-last-in-chain (no following @else, has blank line after)."
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else if {

      } @else {}

      width: 10px;
    }`,
      description:
        "always-last-in-chain (has following @else, this one with no newline after, the following has it)."
    },
    {
      code: `a {
      @if ($x == 1) { } @else if { } @else { }

      width: 10px;
    }`,
      description:
        "always-last-in-chain (has following @else, single-line, this one with no newline after, the following has it)."
    },
    {
      code: `a {
      @if ($x == 1) { } @else { }

      @include x;
    }`,
      description:
        "always-last-in-chain (followed by non-@else at-rule, single-line, empty line after)."
    },
    {
      code: "@if ($x == 1) {} @else { }",
      description: "always-last-in-chain (single line, nothing after)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) {

      } @else {

      } width: 10px;
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else {

      } width: 10px;
    }`,
      description:
        "always-last-in-chain (has decl on the same line as its closing brace).",
      message: messages.expected,
      line: 6
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else if { }
      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else if { }
      @else { }
    }`,
      description: "always-last-in-chain (has following @else, newline after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else { }

      @else { }
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else { }

      @else { }
    }`,
      description:
        "always-last-in-chain (has following @else, empty line after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else {} @include x;
    }`,
      fixed: `a {
      @if ($x == 1) {

      } @else {} @include x;
    }`,
      description:
        "always-last-in-chain (followed by non-@else at-rule, no newline after).",
      message: messages.expected,
      line: 4
    }
  ]
});
