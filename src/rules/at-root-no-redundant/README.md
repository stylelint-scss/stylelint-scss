# at-root-no-redundant

Disallow redundant `@at-root` rule.

<!-- prettier-ignore -->
```scss
@at-root .a { margin: 3px; }
/** ↑
 * This rule is unnecessary 
 */
```

The `@at-root` rule is redundant in the following cases:

- If `@at-root` is already at the root of the document.
- If any `@at-root` selector contains the parent selector, [`&`](https://sass-lang.com/documentation/style-rules/parent-selector/), outside interpolation.
- If `@at-root` is nested within a `@keyframes` block.

## Options

### `true`

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
@at-root .a { margin: 3px; }
```

<!-- prettier-ignore -->
```scss
.a { @at-root .b & { margin: 3px; } }
```

<!-- prettier-ignore -->
```scss
@keyframes slidein {
  @at-root from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(100%);
  }
}
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
.a { @at-root .b { margin: 3px; } }
```

<!-- prettier-ignore -->
```scss
.a { @at-root .b#{&} { margin: 3px; } }
```

<!-- prettier-ignore -->
```scss
.a {
  @at-root .b {
    @keyframes slidein {
      from {
        transform: translateX(0%);
      }
    
      to {
        transform: translateX(100%);
      }
    }
  }
}
```
