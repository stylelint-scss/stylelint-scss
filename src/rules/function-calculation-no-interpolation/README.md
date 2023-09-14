# function-calculation-no-interpolation

Disallow interpolation in `calc()`, `clamp()`, `min()`, and `max()` functions.

<!-- prettier-ignore -->
```scss
.a { .b: calc(#{$c} + 1); }
/**            ↑
      * This argument */
```

Since the release of [first-class `calc()`](https://sass-lang.com/documentation/values/calculations/),
calculation functions `calc()`, `clamp()`, `min()`, and `max()` accept variables
and function calls as arguments. This rule disallows interpolation to avoid
extra verbose or even invalid CSS.

## Options

### `true`

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
$c: 1;
.a { .b: calc(#{$c + 1}); }
```

<!-- prettier-ignore -->
```scss
$c: 1;
.a { .b: calc(max(#{$c})); }
```

<!-- prettier-ignore -->
```scss
$c: 1;
.a { .b: min(#{$c}); }
```

<!-- prettier-ignore -->
```scss
$c: 1;
.a { .b: clamp(#{$c} + 2px); }
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
.a { .b: calc(1 + 1); }
```

<!-- prettier-ignore -->
```scss
$c: 1;
.a { .b: abc(#{$c} + 1px); }
```

<!-- prettier-ignore -->
```scss
$c: 1;
.a { .b: calc(abc(#{$c})); }
```
