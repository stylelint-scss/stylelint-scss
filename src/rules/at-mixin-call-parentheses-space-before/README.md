# at-mixin-call-parentheses-space-before

Require or disallow a space before `@include` parentheses.

```scss
@include foo ($arg)
/**        ↑
 * The space before this parenthesis */
```

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"`

### `"always"`

There *must always* be exactly one space between the mixin name and the opening parenthesis.

*Note: This rule does not enforce parentheses to be present in a declaration without arguments.*

The following patterns are considered warnings:

```scss
@include foo($arg)
```
```scss
@include foo  ($arg)
```

The following patterns are *not* considered warnings:

```scss
@include foo ($arg)
```
```scss
@include foo
```

### `"never"`

There *must never* be any whitespace between the mixin name and the opening parenthesis.

The following patterns are considered warnings:

```scss
@include foo ($arg)
```

The following patterns are *not* considered warnings:

```scss
@include foo($arg)
```
```scss
@include foo
```
