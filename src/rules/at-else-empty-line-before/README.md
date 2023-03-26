# at-else-empty-line-before

Require an empty line or disallow empty lines before `@`-else.

```scss
@if ($a == 0) { }
                      /* ← */
@else if ($x == 2) { }   ↑
                         ↑
/**                      ↑
 * This empty line */
```

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule.

`@if` and `@else` statements might need to have different behavior than all the other at-rules. For that you might need to set `"ignoreAtRules": ["else"]` for Stylelint's core rule [`at-rule-empty-line-before`](https://stylelint.io/user-guide/rules/at-rule-empty-line-before). But that would make you unable to disallow empty lines before `@else` while forcing it to be on a new line. This rule is designed to solve exactly that.

## Options

`string`: `"never"`

There is no `"always"`, `"always-single-line"` options, because for such cases Stylelint's `at-rule-empty-line-before` would work.

### `"never"`

There *must never* be an empty line before `@else` statements.

The following patterns are considered warnings:

```scss
@if ($x == 1) {
  // ...
}

@else {}
```
```scss
@if ($x == 1) {
  // ...
} @else if ($x == 2) {
  // ...
}


@else { }
```

The following patterns are *not* considered warnings:

```scss
@if ($x == 1) {
  // ...
} @else if ($x == 2) {
  // ...
} @else {}

a {
  @if ($x == 1) {
    // ...
  }
  @else ($x == 2) {
    // ...
  }
}
```

## Caveats

If you use autofix, this rule could clash with [`at-mixin-parentheses-space-before`](../at-mixin-parentheses-space-before/README.md) rule.
