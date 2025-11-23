# dollar-variable-no-missing-interpolation

This rule flags four situations in which Sass variables require interpolation: 

1. String-valued variables with custom identifier properties,
2. Variables in custom identifier at-rules,
3. Variables in `@supports` conditions, and
4. Variables in CSS custom properties.

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule. 

**Note:** For scenarios 1 and 3 regarding string-valued variables, this rule can only check variables that are defined in the same file where they are used, since it needs to determine if the variable's value is a string. Scenarios 2 and 4 check all variables regardless of where they are defined.

## 1. String-valued variables with custom identifier properties

Sass variables that contain a custom identifier as a **string** require interpolation when used with properties that accept custom identifiers (such as [`animation-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name), [`counter-reset`](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-reset), [`counter-increment`](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-increment), [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type), and [`will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)).

For example, if you store a custom identifier as a string:

```scss
$foo: "bar";
```

Then you must interpolate it when using it with custom identifier properties:

```scss
animation: #{$foo} 5s;
```

Without interpolation, Sass will compile the variable to a quoted string, producing invalid CSS:

```scss
animation: "bar" 5s; // Invalid!
```

### Examples

The following patterns are considered warnings:

```scss
$foo: "bar"; // String value

.class {
  animation-name: $foo; // ✗ Requires interpolation
}
```

```scss
$foo: "baz"; // String value

body {
  counter-reset: $foo; // ✗ Requires interpolation
}
```

```scss
$foo: "bar"; // String value

.class {
  animation: $foo 5s; // ✗ Requires interpolation
}
```

The following patterns are _not_ considered warnings:

```scss
$foo: "bar"; // String value

.class {
  animation-name: #{$foo}; // ✓ Properly interpolated
}
```

```scss
$foo: "bar"; // String value

.class {
  animation: #{$foo} 5s ease-in-out; // ✓ Properly interpolated
}
```

```scss
$foo: baz; // Non-string value

body {
  counter-reset: $foo; // ✓ No interpolation needed for non-string
}
```

```scss
$foo: bar; // Non-string value

.class {
  animation-name: $foo; // ✓ No interpolation needed for non-string
}
```

## 2. Variables in custom identifier at-rules

Certain CSS [at-rules](https://css-tricks.com/the-at-rules-of-css/) that accept custom identifiers ([`@keyframes`](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes), [`@counter-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style)) **always** require variable interpolation, regardless of whether the variable's value is a string or not.

The following patterns are considered warnings:

```scss
$foo: bar; // Non-string value

@keyframes $foo {} // ✗ Requires interpolation (even for non-string)
```

```scss
$foo: "bar"; // String value

@keyframes $foo {} // ✗ Requires interpolation
```

```scss
$foo: "baz"; // String value

@counter-style $foo { // ✗ Requires interpolation
  system: fixed;
  symbols: ➀ ➁ ➂;
  suffix: ' ';
  speak-as: numbers;
}
```

```scss
$foo: baz; // Non-string value

@counter-style $foo { // ✗ Requires interpolation (even for non-string)
  system: fixed;
  symbols: ➀ ➁ ➂;
}
```

The following patterns are _not_ considered warnings:

```scss
$foo: bar; // Non-string value

@keyframes #{$foo} {} // ✓ Properly interpolated
```

```scss
$foo: "bar"; // String value

@keyframes #{$foo} {} // ✓ Properly interpolated
```

```scss
$foo: baz; // Non-string value

@counter-style #{$foo} { // ✓ Properly interpolated
  system: fixed;
  symbols: ➀ ➁ ➂;
  suffix: ' ';
  speak-as: numbers;
}
```

```scss
$foo: "baz"; // String value

@counter-style #{$foo} { // ✓ Properly interpolated
  system: fixed;
  symbols: ➀ ➁ ➂;
}
```

## 3. Variables in `@supports` conditions

Variables used in [`@supports`](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) conditions with custom identifier properties require interpolation when the variable's value is a **string**.

The following patterns are considered warnings:

```scss
$foo: "bar"; // String value

@supports (animation-name: $foo) { // ✗ Requires interpolation
  @keyframes {}
}
```

```scss
$foo: "baz"; // String value

@supports (counter-reset: $foo) { // ✗ Requires interpolation
  body { counter-reset: #{$foo}; }
}
```

The following patterns are _not_ considered warnings:

```scss
$foo: "bar"; // String value

@supports (animation-name: #{$foo}) { // ✓ Properly interpolated
  @keyframes {}
}
```

```scss
$foo: bar; // Non-string value

@supports (animation-name: $foo) { // ✓ No interpolation needed for non-string
  @keyframes {}
}
```

```scss
$foo: baz; // Non-string value

@supports (counter-reset: $foo) { // ✓ No interpolation needed for non-string
  body { counter-reset: $foo; }
}
```

## 4. Variables in CSS custom properties

SCSS variables used in [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) (CSS variables starting with `--`) _always_ require interpolation, regardless of whether the variable's value is a string or not. Without interpolation, SCSS variables in custom properties are output as literal strings instead of their values.

The following patterns are considered warnings:

```scss
$foo: 2rem; // Non-string value

a {
  --spacing: $foo; // ✗ Requires interpolation (even for non-string)
}
```

```scss
$foo: "2rem"; // String value

a {
  --spacing: $foo; // ✗ Requires interpolation
}
```

```scss
$foo: #007bff; // Non-string value
$bar: #6c757d; // Non-string value

a {
  --color-primary: $foo; // ✗ Requires interpolation
  --color-secondary: $bar; // ✗ Requires interpolation
}
```

```scss
$bar: 10px; // Non-string value
$baz: 20px; // Non-string value

a {
  --foo: calc($bar + $baz); // ✗ Both variables require interpolation
}
```

The following patterns are _not_ considered warnings:

```scss
$foo: 2rem; // Non-string value

a {
  --spacing: #{$foo}; // ✓ Properly interpolated
}
```

```scss
$foo: "2rem"; // String value

a {
  --spacing: #{$foo}; // ✓ Properly interpolated
}
```

```scss
$foo: #007bff; // Non-string value
$bar: #6c757d; // Non-string value

a {
  --color-primary: #{$foo}; // ✓ Properly interpolated
  --color-secondary: #{$bar}; // ✓ Properly interpolated
}
```

```scss
$bar: 10px; // Non-string value
$baz: 20px; // Non-string value

a {
  --foo: calc(#{$bar} + #{$baz}); // ✓ Both variables properly interpolated
}
```

```scss
a {
  --foo: var(--bar); // ✓ CSS variable reference, not an SCSS variable
}
```

```scss
$foo: 2rem; // Non-string value

a {
  padding: $foo; // ✓ Not a custom property, no interpolation needed
}
```

```scss
$foo: 5;

a {
  --scale: #{calculate-scale($foo)}; // ✓ Variable already inside interpolation
}
```

## Further Reading

- [Sass Documentation: Interpolation](https://sass-lang.com/documentation/interpolation)
- [Sass Documentation: Custom Properties](https://sass-lang.com/documentation/style-rules/declarations/#custom-properties)