# custom-property-no-missing-interpolation

Require interpolation for SCSS variables used in CSS custom property values.

<!-- prettier-ignore -->
```scss
a {
  --foo: $bar;
/**       ↑
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
a {
  --foo: $bar;
}
```

<!-- prettier-ignore -->
```scss
a {
  --foo: calc(100% - $bar);
}
```

<!-- prettier-ignore -->
```scss
a {
  --foo: calc($bar + $baz);
}
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
a {
  --foo: #{$bar};
}
```

<!-- prettier-ignore -->
```scss
a {
  --foo: calc(100% - #{$bar});
}
```

<!-- prettier-ignore -->
```scss
a {
  --foo: calc(#{$bar} + #{$baz});
}
```

<!-- prettier-ignore -->
```scss
a {
  --foo: var(--bar);
}
```

<!-- prettier-ignore -->
```scss
a {
  color: $bar; // Not a custom property
}
```

<!-- prettier-ignore -->
```scss
a {
  --foo: #{calculate-scale($i)}; // Variable already inside interpolation
}
```

## Further Reading

- [Sass Documentation: Custom Properties](https://sass-lang.com/documentation/style-rules/declarations/#custom-properties)
