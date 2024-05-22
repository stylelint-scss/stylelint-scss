# load-no-partial-leading-underscore

Disallow leading underscore in partial names in `@import`, `@use`, `@forward`, and [`meta.load-css`](https://sass-lang.com/documentation/modules/meta/#load-css) `$url` parameter.

```scss
@import "path/to/_file";
/**              ↑
 *   Disallow this */
```

The rule ignores [cases](https://sass-lang.com/documentation/at-rules/import) when Sass considers an `@import` command just a plain CSS import:

* If the file’s extension is `.css`.
* If the filename begins with `http://` (or any other protocol).
* If the filename is a `url()`.
* If the `@import` has any media queries.


The following patterns are considered warnings:

```scss
@import "_foo";
```

```scss
@import "path/_fff";
```

```scss
@forward "path\\_fff"; /* Windows delimiters */
```

```scss
@use "df/fff", "_1.scss";
```

```scss
@use "sass:meta";
.a {
  @include meta.load-css("_fff", $with: ("border-contrast": true));
}
```

The following patterns are _not_ considered warnings:

```scss
@use "_path/fff"; /* underscore in a directory name, not in a partial name */
```

```scss
@import url("path/_file.css"); /* has url(), so doesn't count as a partial @import */
```

```scss
@forward "_file.css"; /* Has ".css" extension, so doesn't count as a partial @import */
```

```scss
/* Both are URIs, so don't count as partial @imports */
@import "http://_file.scss";
@import "//_file.scss";
```

```scss
@import "_file.scss" screen; /* Has a media query, so doesn't count as a partial @import */
```

```scss
@use "sass:meta";
.a {
  @include meta.load-css("dark-theme/code", $with: ("border-contrast": true));
}
```
