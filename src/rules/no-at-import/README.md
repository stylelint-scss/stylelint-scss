# no-at-import

According to the [Sass documentation](https://sass-lang.com/documentation/at-rules/import), you should no longer use the `@import` rule:

> The Sass team discourages the continued use of the @import rule. Sass will gradually phase it out over the next few years, and eventually remove it from the language entirely. Prefer the @use rule instead.

With this rule you can disallow the usage of any `@import` and force `@use`.

## Options

### `true`

The following patterns are considered violations:

```scss
@import "test";
```

```scss
@import 'test';
```
