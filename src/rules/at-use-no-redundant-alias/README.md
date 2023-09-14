# at-use-no-redundant-alias

Disallow redundant namespace aliases.

```scss
@use "foo" as foo;
/**           ↑
 * Disallow this */
```

By default, the [module's namespace](https://sass-lang.com/documentation/at-rules/use/#loading-members)
is the last component of the module’s URL.

## Options

### `true`

The following patterns are considered warnings:

```scss
@use "foo" as foo;
```

```scss
@use "sass:math" as math;
```

```scss
@use "src/corners" as corners;
```

The following patterns are _not_ considered warnings:

```scss
@use "foo" as bar;
```

```scss
@use "sass:math";
```

```scss
@use "src/corners" as c;
```
