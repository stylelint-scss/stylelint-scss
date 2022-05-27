# dollar-variable-colon-space-before

Require a single space or disallow whitespace before the colon in `$`-variable declarations.

```scss
$variable: 10px;
/**      ↑
 * The space before this colon */
```

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always"|"never"

### `"always"`

There *must always* be a single space before the colon.

The following patterns are considered warnings:

```scss
a { $var: 10px }
```

```scss
$var:10px;
```

```scss
$var  :10px;
```

```scss
$var
:10px;
```

The following patterns are *not* considered warnings:

```scss
a { $var : 10px }
```

```scss
$var :10px;
```

### `"never"`

There *must never* be whitespace before the colon.

The following patterns are considered warnings:

```scss
$var :10px;
```

```scss
a { $var
:10px }
```

The following patterns are *not* considered warnings:

```scss
$var:10px;
```

```scss
a { $var: 10px }
```
