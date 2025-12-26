# double-slash-comment-whitespace-inside

Require or disallow whitespace after the `//` in `//`-comments

```scss
a {
  width: 10px; // inline-comment
/*               ↑
 * Such whitespace */
```

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule.

This rule only works with SCSS-like [single-line comments](https://sass-lang.com/documentation/syntax/comments) and ignores CSS comments (`/* */`).

Any number of slashes are allowed at the beginning of the comment. So `/// comment` is treated the same way as `// comment`.

Note that a newline is not possible as a whitespace in terms of this rule as `//`-comments are intended to be single-line.

## Options

`string`: `"always"|"never"`

### `"always"`

There _must always_ be whitespace after the `//` inside `//`-comments.

The following patterns are considered warnings:

```scss
//comment
```

The following patterns are _not_ considered warnings:

```scss
// comment
```

```scss
///   comment
```

### `"never"`

There _must never_ be whitespace after the `//` inside `//`-comments.

The following patterns are considered warnings:

```scss
// comment
```

The following patterns are _not_ considered warnings:

```scss
//comment
```

```scss
///comment
```
