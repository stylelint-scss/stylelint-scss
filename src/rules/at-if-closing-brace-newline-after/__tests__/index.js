import rule, { ruleName, messages } from "..";
import testRule from "stylelint-test-rule-tape";

testRule(rule, {
  ruleName,
  config: ["always-last-in-chain"],
  syntax: "scss",

  accept: [
    {
      code: `a {
      @if ($x == 1) {}
      width: 10px;
    }`,
      description: "always-last-in-chain (no @else, has newline after)."
    },
    {
      code: `a {
      @if ($x == 1) {}

      width: 10px;
    }`,
      description: "always-last-in-chain (no @else, has blank line after)."
    },
    {
      code: `a {
      @if ($x == 1) {

      } @else {}

      width: 10px;
    }`,
      description: "always-last-in-chain (has @else, no newline after)."
    },
    {
      code: `a {
      @if ($x == 1) {

      } @elseif {

      } @else {}

      width: 10px;
    }`,
      description:
        "always-last-in-chain (has @else and @elseif, no newline after)."
    },
    {
      code: `a {
      @if ($x == 1) { } @else { }

      width: 10px;
    }`,
      description:
        "always-last-in-chain (has @else, single-line, no newline after)."
    },
    {
      code: `a {
      @if ($x == 1) { } @elseif { } @else { }

      width: 10px;
    }`,
      description:
        "always-last-in-chain (has @else and @elseif, single-line, no newline after)."
    },
    {
      code: `a {
      @if ($x == 1) { }

      @include x;
    }`,
      description:
        "always-last-in-chain (followed by non-@else at-rule, single-line, empty line after)."
    },
    {
      code: "@if ($x == 1) {}",
      description: "always-last-in-chain (single line, nothing after)."
    }
  ],

  reject: [
    {
      code: `a {
      @if ($x == 1) {

      } width: 10px;
    }`,
      description:
        "always-last-in-chain (has decl on the same line as its closing brace).",
      message: messages.expected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      }
      @else { }
    }`,
      description: "always-last-in-chain (has @else, newline after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      }

      @else { }
    }`,
      description: "always-last-in-chain (has @else, empty line after).",
      message: messages.rejected,
      line: 4
    },
    {
      code: `a {
      @if ($x == 1) {

      } @include x;
    }`,
      description:
        "always-last-in-chain (followed by non-@else at-rule, no newline after).",
      message: messages.expected,
      line: 4
    }
  ]
});
