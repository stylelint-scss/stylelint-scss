# at-import-no-import

Disallow the usage of any `@import` and thus force `@use`.

## Options

### `true`

The following patterns are considered violations:

```scss
@import "test";
```

```scss
@import 'test';
```
