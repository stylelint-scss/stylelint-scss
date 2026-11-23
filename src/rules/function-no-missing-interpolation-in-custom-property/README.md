# function-no-missing-interpolation-in-custom-property

Disallow Sass function calls without interpolation in CSS custom property values.

<!-- prettier-ignore -->
```scss
.a { --color: tokens.get("color.fg"); }
/**           ↑
 * This function call */
```

Sass doesn't evaluate the values of CSS custom properties, so a function call
is output as literal text unless it is wrapped in `#{}` interpolation. No error
is thrown, which makes the bug easy to miss.

This rule reports:

- namespaced function calls, e.g. `math.div()` or `tokens.get()`,
- global Sass functions that are not also CSS functions, e.g. `lighten()` or `map-get()`,
- functions defined with `@function` in the same file.

Native CSS functions such as `var()`, `calc()` or `rgb()` are not reported.
Only the outermost Sass function call is reported, since interpolating it
interpolates the nested ones too.

To check Sass variables in custom properties, use
[`dollar-variable-no-missing-interpolation`](../dollar-variable-no-missing-interpolation/README.md).

The [`fix` option](https://stylelint.io/user-guide/options#fix) can automatically fix all of the problems reported by this rule.

## Options

### `true`

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
.a { --color: tokens.get("color.fg"); }
```

<!-- prettier-ignore -->
```scss
.a { --size: math.div(16px, 2); }
```

<!-- prettier-ignore -->
```scss
.a { --shadow: lighten($base, 10%); }
```

<!-- prettier-ignore -->
```scss
.a { --size: calc(math.div(16px, 2) + 1px); }
```

<!-- prettier-ignore -->
```scss
@function double($n) {
  @return $n * 2;
}

.a { --size: double(2px); }
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
.a { --color: #{tokens.get("color.fg")}; }
```

<!-- prettier-ignore -->
```scss
.a { --size: #{math.div(16px, 2)}; }
```

<!-- prettier-ignore -->
```scss
.a { --size: calc(#{math.div(16px, 2)} + 1px); }
```

<!-- prettier-ignore -->
```scss
.a {
  --color: red;
  --size: 16px;
  --duration: var(--speed);
}
```

<!-- prettier-ignore -->
```scss
.a { width: math.div(16px, 2); }
```
