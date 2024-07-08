# load-partial-extension

Require or disallow extension in `@import`, `@use`, `@forward`, and [`meta.load-css`] commands.

```scss
@use "file.scss";
/**       ↑
 * This extension */
```

```scss
@use "sass:meta";

body {
  @include meta.load-css("fff.scss",
                  /**         ↑
                  * This extension */
      $with: ("border-contrast": true));
}
```

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule only when `"never"` is given.

The rule ignores [cases](https://sass-lang.com/documentation/at-rules/import) when Sass considers an `@import` command just a plain CSS import:

- If the file’s extension is `.css`.
- If the filename begins with `http://` (or any other protocol).
- If the filename is a `url()`.
- If the `@import` has any media queries.

## Options

`string`: `"always"|"never"`

### `"always"`

The following patterns are considered warnings:

```scss
@import "foo";
```

```scss
@use "path/fff";
```

```scss
@forward "path/fff";
```

```scss
@use "path\\fff";
```

```scss
@use "df/fff", "1.SCSS";
```

The following patterns are _not_ considered warnings:

```scss
@use "fff.scss";
```

```scss
@forward "path/fff.scss";
```

```scss
@import url("path/_file.css"); /* has url(), so doesn't count as a partial @import */
```

```scss
@use "file.css"; /* Has ".css" extension, so doesn't count as a partial @import */
```

```scss
/* Both are URIs, so don't count as partial @imports */
@use "http://_file.scss";
@use "//_file.scss";
```

```scss
@import "file.scss" screen; /* Has a media query, so doesn't count as a partial @import */
```

### `"never"`

The following patterns are considered warnings:

```scss
@import "foo.scss";
```

```scss
@use "path/fff.less";
```

```scss
@forward "path/fff.scss";
```

```scss
@use "path\\fff.ruthless";
```

```scss
@use "df/fff", "1.SCSS";
```

```scss
@use "sass:meta";

body {
  @include meta.load-css("foo.scss", 
    $with: ("border-contrast": true));
}
```

The following patterns are _not_ considered warnings:

```scss
@use "foo";
```

```scss
@use "path/fff";
```

```scss
@import url("path/_file.css"); /* has url(), so doesn't count as a partial @import */
```

```scss
@use "file.css"; /* Has ".css" extension, so doesn't count as a partial @import */
```

```scss
@forward "path/fff";
```

```scss
/* Both are URIs, so don't count as partial @imports */
@import "http://_file.scss";
@import "//_file.scss";
```

```scss
@import "file.scss" screen; /* Has a media query, so doesn't count as a partial @import */
```

```scss
@use "sass:meta";

body {
  @include meta.load-css("path/foo", 
    $with: ("border-contrast": true));
}
```
