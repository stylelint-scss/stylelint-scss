# custom-property-no-missing-interpolation

Require interpolation for SCSS variables used in CSS custom property values.

<!-- prettier-ignore -->
```scss
:root {
  --size: $base-margin;
/**        ↑
 * This SCSS variable requires interpolation */
}
```

SCSS variables used directly in CSS custom properties (CSS variables starting with `--`) will be output literally instead of their values. To properly use an SCSS variable in a CSS custom property, you must wrap it in interpolation syntax `#{...}`.

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule.

## Options

`true`

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
.foo {
  --size: $base-margin;
}
```

<!-- prettier-ignore -->
```scss
.foo {
  --size: calc(100% - $base-margin);
}
```

<!-- prettier-ignore -->
```scss
.foo {
  --size: calc($var1 + $var2);
}
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
.foo {
  --size: #{$base-margin};
}
```

<!-- prettier-ignore -->
```scss
.foo {
  --size: calc(100% - #{$base-margin});
}
```

<!-- prettier-ignore -->
```scss
.foo {
  --size: calc(#{$var1} + #{$var2});
}
```

<!-- prettier-ignore -->
```scss
.foo {
  --size: var(--base-margin);
}
```

<!-- prettier-ignore -->
```scss
.foo {
  margin: $base-margin; // Not a custom property
}
```

<!-- prettier-ignore -->
```scss
.foo {
  --size: #{calculate-scale($index)}; // Variable already inside interpolation
}
```

## Further Reading

- [Sass Documentation: Custom Properties](https://sass-lang.com/documentation/style-rules/declarations/#custom-properties)
