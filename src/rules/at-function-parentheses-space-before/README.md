# at-function-parentheses-space-before

Require or disallow a space before `@function` parentheses.

```scss
@function foo ($arg) { }
/**           ↑
 * The space before this parenthesis */
```

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be exactly one space between the function name and the opening parenthesis.

The following patterns are considered warnings:

```scss
@function foo($arg) { }
```
```scss
@function foo  ($arg) { }
```

The following patterns are *not* considered warnings:

```scss
@function foo ($arg) { }
```

### `"never"`

There *must never* be any whitespace between the function name and the opening parenthesis.

The following patterns are considered warnings:

```scss
@function foo ($arg) { }
```

The following patterns are *not* considered warnings:

```scss
@function foo($arg) { }
```
