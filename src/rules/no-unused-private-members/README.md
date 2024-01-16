# no-unused-private-members

Disallow unused private members.

<!-- prettier-ignore -->
```scss
@function _addNums($n1, $n2) {
/**       ↑
 * This function */
  @return calc($n1 + $n2);
}

@mixin _no-margin {
/**    ↑
 * This mixin */
  margin: 0;
}

%-toolbelt:hover {
/* ↑
 * This placeholder selector */
  color: red;
}

.a {
  $-b: 1;
/** ↑
 * This variable */
}
```

[Private members](https://sass-lang.com/documentation/at-rules/use/#private-members), such as functions, mixins, variables, and selector placeholders are defined with names that start with either `-` or `_` (in the case of variables the name follows `$`, and the same applies to the `%` prefix for selector placeholders). These private members remain confined within the module, therefore, if they go unused within the module, they are considered unused.

This rule ignores files using `@import` since all files loaded through it are consolidated within the same module. This setup makes it tricky to ensure all usages of private members.

## Options

### `true`

The following patterns are considered problems:

<!-- prettier-ignore -->
```scss
@function _addNums($n1, $n2) {
  @return calc($n1 + $n2);
}

@function _plusOne($n1) {
  @return $n1 + 1;
}

.sidebar {
  margin-left: _addNums(4, 6); // _plusOne() is not used.
}
```

<!-- prettier-ignore -->
```scss
@mixin _no-margin {
  margin: 0;
}

@mixin blue-color {
  color: blue;
}

nav ul {
  @include blue-color; // _no-margin is not used.
}   
```

<!-- prettier-ignore -->
```scss
$radius: 3px;
$-margin: 3px;

.rounded {
  border-radius: $radius; // $-margin is not used.
}
```

<!-- prettier-ignore -->
```scss
%-toolbelt:hover {
  color: red;
}

.a.%b {
  margin: 1px;
}

.action-buttons {
  @extend %b; // %-toolbelt is not used.
  color: blue;
}
```

The following patterns are _not_ considered problems:


<!-- prettier-ignore -->
```scss
@function _addNums($n1, $n2) {
  @return calc($n1 + $n2);
}

@function _plusOne($n1) {
  @return $n1 + 1;
}

.sidebar {
  margin-left: _addNums(4, 6) + _plusOne(1);
}
```

<!-- prettier-ignore -->
```scss
@mixin _no-margin {
  margin: 0;
}

@mixin blue-color {
  color: blue;
}

nav ul {
  @include blue-color;
  @include _no-margin;
}   
```

<!-- prettier-ignore -->
```scss
$radius: 3px;
$-margin: 3px;

.rounded {
  border-radius: $radius;
  margin: $-margin;
}
```

<!-- prettier-ignore -->
```scss
%-toolbelt:hover {
  color: red;
}

.a.%b {
  margin: 1px;
}

.action-buttons {
  @extend %b;
  @extend %-toolbelt;
  color: blue;
}
```