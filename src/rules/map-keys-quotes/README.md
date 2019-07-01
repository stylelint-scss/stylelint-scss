# map-keys-quotes

All map keys should be quoted.

```scss
$test: (Helvetica: 14px, Arial: 25px);
  /**   ↑                ↑
   * These words should be quoted.
   */
```

## Options

### `true`

The following patterns are considered violations:

```scss
$test: (Helvetica: 14px, Arial: 25px);
```

The following patterns are _not_ considered violations:

```scss
$test: ("foo": 14px, "bar": 25px);
```
