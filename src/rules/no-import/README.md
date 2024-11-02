# no-import

Disallow `@import` declarations due to their [deprecation](https://sass-lang.com/documentation/at-rules/import/) in favor of `@use` and `@forward`.

```scss
@import "file"
/** ↑
 * This is the deprecated declaration */
```

## Options

### `true`

The following patterns are considered warnings:

```scss
@import "file";
@import "file.css";
@import "file.scss";
@import "_partial";
@import "http://file.scss";
@import url("file");
```

The following patterns are *not* considered warnings:

```scss
@use "file";
@forward "file";
```
