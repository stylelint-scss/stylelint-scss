# property-no-unknown

Disallow unknown properties. Should be used instead of Stylelint's [property-no-unknown](https://stylelint.io/user-guide/rules/property-no-unknown).

<!-- prettier-ignore -->
```scss
a { height: 100%; }
/** ↑
 * This property */
```

This rule considers properties defined in the [CSS Specifications and browser specific properties](https://github.com/betit/known-css-properties#source) to be known.

This rule ignores:

- variables (`$sass`, `@less`, `--custom-property`)
- vendor-prefixed properties (e.g., `-moz-align-self`, `-webkit-align-self`)

Use option `checkPrefixed` described below to turn on checking of vendor-prefixed properties.

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```scss
a {
  colr: blue;
}
```

<!-- prettier-ignore -->
```scss
a {
  my-property: 1;
}
```

<!-- prettier-ignore -->
```scss
a {
  font: {
    stuff: bold;
  }
}
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```scss
a {
  color: green;
}
```

<!-- prettier-ignore -->
```scss
a {
  fill: black;
}
```

<!-- prettier-ignore -->
```scss
a {
  -moz-align-self: center;
}
```

<!-- prettier-ignore -->
```scss
a {
  -webkit-align-self: center;
}
```

<!-- prettier-ignore -->
```scss
a {
  align-self: center;
}
```

<!-- prettier-ignore -->
```scss
a {
  font: {
    weight: bold;
  }
}
```

## Optional secondary options

### `ignoreProperties: ["/regex/", /regex/, "string"]`

Given:

```json
["/^my-/", "custom"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```scss
a {
  my-property: 10px;
}
```

<!-- prettier-ignore -->
```scss
a {
  my-other-property: 10px;
}
```

<!-- prettier-ignore -->
```scss
a {
  custom: 10px;
}
```

### `ignoreSelectors: ["/regex/", /regex/, "string"]`

Skips checking properties of the given selectors against this rule.

Given:

```json
[":root"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```scss
:root {
  my-property: blue;
}
```

### `ignoreAtRules: ["/regex/", /regex/, "string"]`

Ignores properties nested within specified at-rules.

Given:

```json
["supports"]
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```scss
@supports (display: grid) {
  a {
    my-property: 1;
  }
}
```

### `checkPrefixed: true | false` (default: `false`)

If `true`, this rule will check vendor-prefixed properties.

For example with `true`:

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```scss
a {
  -webkit-overflow-scrolling: auto;
}
```

<!-- prettier-ignore -->
```scss
a {
  -moz-box-flex: 0;
}
```

The following patterns are considered problems:

<!-- prettier-ignore -->
```scss
a {
  -moz-align-self: center;
}
```

<!-- prettier-ignore -->
```scss
a {
  -moz-overflow-scrolling: center;
}
```
