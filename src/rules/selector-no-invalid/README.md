# selector-no-invalid

Disallow invalid selectors. Should be used **instead of** Stylelint's [selector-no-invalid](https://stylelint.io/user-guide/rules/selector-no-invalid).

```scss
a::before b {}
/**      ↑
 * Combinators like this after a pseudo-element */
```

This rule understands Sass selector syntax:

- parent selector suffixes, e.g. `&-1` or `&__element`
- placeholder selectors, e.g. `%placeholder`
- `//` comments

Selectors containing interpolation (e.g. `.a-#{$b}`) are ignored.

You must disable Stylelint's core rule to make this rule work:

```json
{
  "rules": {
    "selector-no-invalid": null,
    "scss/selector-no-invalid": true
  }
}
```

## Options

### `true`

The following patterns are considered warnings:

```scss
a,, b {}
```

```scss
a:has(:has(b)) {}
```

```scss
a:not(::before) {}
```

```scss
a::before b {}
```

```scss
a:dir(up) {}
```

```scss
%placeholder::before a {}
```

The following patterns are *not* considered warnings:

```scss
a:has(> b) {}
```

```scss
.a {
  &-1 {}
}
```

```scss
.a %placeholder {}
```

```scss
.a,
// comment
.b {}
```

```scss
.a-#{$b}::before c {}
```
