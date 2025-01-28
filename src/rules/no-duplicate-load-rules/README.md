# no-duplicate-load-rules

Disallow duplicate `@import`, `@use` and `@forward` rules.

<!-- prettier-ignore -->
```css
    @import "a.css";
    @import "a.css";
/** ↑
 * These are duplicates */
```

<!-- prettier-ignore -->
```scss
    @use "a" as a;
    @use "a" as b;
/** ↑
 * These are duplicates */
```

<!-- prettier-ignore -->
```scss
    @forward "a" with ($blue: #333);
    @forward "a" with ($blue: #333);
/** ↑
 * With @forward, they are only considered duplicates if they have the exact same confuguration. */
```

The [`message` secondary option](https://github.com/stylelint/stylelint/blob/main/docs/user-guide/configure.md#message) can accept the arguments of this rule.

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

<!-- prettier-ignore -->
```scss
@forward 'a' with ($blue: #333);
@forward 'a' with ($blue: #333);
```

<!-- prettier-ignore -->
```scss
@forward "a" hide $vertical-list-gap;
@forward "a" hide $vertical-list-gap;
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
