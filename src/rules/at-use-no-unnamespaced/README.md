# at-use-no-unnamespaced

Disallow usage of `@use` without a namespace.

```scss
@use "foo" as *;
/**           ↑
 * Disallow this */
```

The following patterns are considered warnings:

```scss
@use "foo" as *;
```

The following patterns are _not_ considered warnings:

```scss
@use "foo";
```

```scss
@use "foo" as bar;
```
