# load-no-redundant-path

Disallow paths starting with './' in `@import`, `@use`, `@forward`.

```scss
@use "./file.scss";
/**   ↑
 * This path */
```

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule
by removing `./`.

The following patterns are considered warnings:

```scss
@import "./_foo";
```

```scss
@use "./path/_fff";
```

```scss
@forward "file.scss";
```

The following patterns are _not_ considered warnings:

```scss
@use "_foo";
```

```scss
@import "path/_fff";
```

```scss
@forward "file.scss";
```