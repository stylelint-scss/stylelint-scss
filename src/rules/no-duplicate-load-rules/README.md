# no-duplicate-at-import-rules

Disallow duplicate `@import` and `@use` rules.

<!-- prettier-ignore -->
```css
    @import "a.css";
    @import "a.css";
/** ↑
 * These are duplicates */
```

<!-- prettier-ignore -->
```scss
    @use "a";
    @use "a";
/** ↑
 * These are duplicates */
```

The [`message` secondary option](../../../docs/user-guide/configure.md#message) can accept the arguments of this rule.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```css
@import 'a.css';
@import 'a.css';
```

<!-- prettier-ignore -->
```css
@import url("a.css");
@import url("a.css");
```

<!-- prettier-ignore -->
```css
@import "a.css";
@import 'a.css';
```

<!-- prettier-ignore -->
```css
@import "a.css";
@import 'b.css';
@import url(a.css);
```

<!-- prettier-ignore -->
```scss
@use "a";
@use "a";
```

<!-- prettier-ignore -->
```scss
@use "a" as abc;
@use "a" as xyz;
```

<!-- prettier-ignore -->
```scss
@use 'a' with (
$black: #222,
$border-radius: 0.1rem
);
@use 'a' with ($blue: #333);
```

The following patterns are _not_ considered problems:

<!-- prettier-ignore -->
```css
@import "a.css";
@import "b.css";
```

<!-- prettier-ignore -->
```css
@import url('a.css') projection;
@import url('a.css') tv;
```

<!-- prettier-ignore -->
```scss
@use "a";
@use "b";
```

<!-- prettier-ignore -->
```scss
@use "a" as abc;
@use "b" as xyz;
```

<!-- prettier-ignore -->
```scss
@use 'a' with (
$black: #222,
$border-radius: 0.1rem
);
@use 'b' with ($blue: #333);
```

## Optional secondary options

### `includeForward: true`

Disallows duplicate `@forward` rules.

The following patterns are considered problems:
<!-- prettier-ignore -->
```scss
@forward "a";
@forward "a";
```

<!-- prettier-ignore -->
```scss
@forward "a" as abc;
@forward "a" as xyz;
```

<!-- prettier-ignore -->
```scss
@forward 'a' with (
$black: #222,
$border-radius: 0.1rem
);
@forward 'a' with ($blue: #333);
```

<!-- prettier-ignore -->
```scss
@forward "a" hide list-reset, $horizontal-list-gap;
@forward "a" hide $vertical-list-gap;
```

<!-- prettier-ignore -->
```scss
@forward "a" show list-reset, $horizontal-list-gap;
@forward "a" show $vertical-list-gap;
```

The following patterns are _not_ considered problems:
<!-- prettier-ignore -->
```scss
@forward "a";
@forward "b";
```

<!-- prettier-ignore -->
```scss
@forward "a" as abc;
@forward "b" as xyz;
```

<!-- prettier-ignore -->
```scss
@forward 'a' with (
$black: #222,
$border-radius: 0.1rem
);
@forward 'b' with ($blue: #333);
```

<!-- prettier-ignore -->
```scss
@forward "a" hide list-reset, $horizontal-list-gap;
@forward "b" hide $vertical-list-gap;
```

<!-- prettier-ignore -->
```scss
@forward "a" show list-reset, $horizontal-list-gap;
@forward "b" show $vertical-list-gap;
```

### `includeConfigurations: { "atRuleName": true }`

Take into account configurations when checking for duplicate load rules.

Given:

```js
includeConfigurations: {
  use: true,
  forward: true
}
```

The following patterns are considered problems:
<!-- prettier-ignore -->
```scss
@use "a" as abc;
@use "a" as abc;
```

<!-- prettier-ignore -->
```scss
@forward "a" as abc;
@forward "a" as abc;
```

<!-- prettier-ignore -->
```scss
@use 'a' with (
$black: #222,
$border-radius: 0.1rem
);
@use 'a' with (
$black: #222,
$border-radius: 0.1rem
);
```

<!-- prettier-ignore -->
```scss
@forward "a" hide list-reset, $horizontal-list-gap;
@forward "a" hide list-reset, $horizontal-list-gap;
```

<!-- prettier-ignore -->
```scss
@forward "a" show list-reset, $horizontal-list-gap;
@forward "a" show list-reset, $horizontal-list-gap;
```

The following patterns are _not_ considered problems:
<!-- prettier-ignore -->
```scss
@use "a" as abc;
@use "a" as xyz;
```

<!-- prettier-ignore -->
```scss
@forward "a" as abc;
@forward "a" as xyz;
```

<!-- prettier-ignore -->
```scss
@use 'a' with (
$black: #222,
$border-radius: 0.1rem
);
@use 'a' with ($blue: #333);
```

<!-- prettier-ignore -->
```scss
@forward "a" hide list-reset, $horizontal-list-gap;
@forward "a" hide $vertical-list-gap;
```

<!-- prettier-ignore -->
```scss
@forward "a" show list-reset, $horizontal-list-gap;
@forward "a" show $vertical-list-gap;
```