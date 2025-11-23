# dollar-variable-no-missing-interpolation

This rule flags four situations in which Sass variables require interpolation: 

1. String-valued variables with custom identifier properties,
2. Variables in custom identifier at-rules,
3. Variables in `@supports` conditions, and
4. Variables in CSS custom properties.

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule. This rule can only check for variables that are defined inside the same file where they are used.

**Note:** For scenarios 1 and 3 below (string-valued variables), this rule can only check variables that are defined in the same file where they are used, since it needs to determine if the variable's value is a string. Scenarios 2 and 4 check all variables regardless of where they are defined.

## 1. String-valued variables with custom identifier properties

Sass variables that contain a custom identifier as a **string** require interpolation when used with properties that accept custom identifiers (such as [`animation-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name), [`counter-reset`](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-reset), [`counter-increment`](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-increment), [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type), and [`will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)).

**Key point:** This check only applies when the variable's value is a string (wrapped in quotes). Non-string variables do not require interpolation for these properties.

For example, if you store a custom identifier as a string:

<!-- prettier-ignore -->
```scss
$myVar: "myAnim";
```

Then you must interpolate it when using it with custom identifier properties:

<!-- prettier-ignore -->
```scss
animation: #{$myVar} 5s;
```

Without interpolation, Sass will compile the variable to a quoted string, producing invalid CSS:

<!-- prettier-ignore -->
```scss
animation: "myAnim" 5s; // Invalid!
```

### Examples

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
$var: "my-anim"; // String value

.class {
  animation-name: $var; // ✗ Requires interpolation
}
```

<!-- prettier-ignore -->
```scss
$var: "my-counter"; // String value

body {
  counter-reset: $var; // ✗ Requires interpolation
}
```

<!-- prettier-ignore -->
```scss
$var: "my-anim"; // String value

.class {
  animation: $var 5s; // ✗ Requires interpolation
}
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
$var: "my-anim"; // String value

.class {
  animation-name: #{$var}; // ✓ Properly interpolated
}
```

<!-- prettier-ignore -->
```scss
$var: "my-anim"; // String value

.class {
  animation: #{$var} 5s ease-in-out; // ✓ Properly interpolated
}
```

<!-- prettier-ignore -->
```scss
$var: my-counter; // Non-string value

body {
  counter-reset: $var; // ✓ No interpolation needed for non-string
}
```

<!-- prettier-ignore -->
```scss
$var: my-anim; // Non-string value

.class {
  animation-name: $var; // ✓ No interpolation needed for non-string
}
```

## 2. Variables in custom identifier at-rules

Certain CSS [at-rules](https://css-tricks.com/the-at-rules-of-css/) that accept custom identifiers ([`@keyframes`](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes), [`@counter-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style)) **always** require variable interpolation, regardless of whether the variable's value is a string or not.

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
$var: my-anim; // Non-string value

@keyframes $var {} // ✗ Requires interpolation (even for non-string)
```

<!-- prettier-ignore -->
```scss
$var: "my-anim"; // String value

@keyframes $var {} // ✗ Requires interpolation
```

<!-- prettier-ignore -->
```scss
$var: "circled-digits"; // String value

@counter-style $var { // ✗ Requires interpolation
  system: fixed;
  symbols: ➀ ➁ ➂;
  suffix: ' ';
  speak-as: numbers;
}
```

<!-- prettier-ignore -->
```scss
$var: circled-digits; // Non-string value

@counter-style $var { // ✗ Requires interpolation (even for non-string)
  system: fixed;
  symbols: ➀ ➁ ➂;
}
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
$var: my-anim; // Non-string value

@keyframes #{$var} {} // ✓ Properly interpolated
```

<!-- prettier-ignore -->
```scss
$var: "my-anim"; // String value

@keyframes #{$var} {} // ✓ Properly interpolated
```

<!-- prettier-ignore -->
```scss
$var: circled-digits; // Non-string value

@counter-style #{$var} { // ✓ Properly interpolated
  system: fixed;
  symbols: ➀ ➁ ➂;
  suffix: ' ';
  speak-as: numbers;
}
```

<!-- prettier-ignore -->
```scss
$var: "circled-digits"; // String value

@counter-style #{$var} { // ✓ Properly interpolated
  system: fixed;
  symbols: ➀ ➁ ➂;
}
```

## 3. Variables in `@supports` conditions

Variables used in [`@supports`](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) conditions with custom identifier properties require interpolation when the variable's value is a **string**.

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
$var: "my-anim"; // String value

@supports (animation-name: $var) { // ✗ Requires interpolation
  @keyframes {}
}
```

<!-- prettier-ignore -->
```scss
$var: "my-counter"; // String value

@supports (counter-reset: $var) { // ✗ Requires interpolation
  body { counter-reset: #{$var}; }
}
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
$var: "my-anim"; // String value

@supports (animation-name: #{$var}) { // ✓ Properly interpolated
  @keyframes {}
}
```

<!-- prettier-ignore -->
```scss
$var: my-anim; // Non-string value

@supports (animation-name: $var) { // ✓ No interpolation needed for non-string
  @keyframes {}
}
```

<!-- prettier-ignore -->
```scss
$var: my-counter; // Non-string value

@supports (counter-reset: $var) { // ✓ No interpolation needed for non-string
  body { counter-reset: $var; }
}
```

## 4. Variables in CSS custom properties

SCSS variables used in [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) (CSS variables starting with `--`) _always_ require interpolation, regardless of whether the variable's value is a string or not. Without interpolation, SCSS variables in custom properties are output as literal strings instead of their values.

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
$var: 2rem; // Non-string value

a {
  --spacing: $var; // ✗ Requires interpolation (even for non-string)
}
```

<!-- prettier-ignore -->
```scss
$var: "2rem"; // String value

a {
  --spacing: $var; // ✗ Requires interpolation
}
```

<!-- prettier-ignore -->
```scss
$primary: #007bff; // Non-string value
$secondary: #6c757d; // Non-string value

a {
  --color-primary: $primary; // ✗ Requires interpolation
  --color-secondary: $secondary; // ✗ Requires interpolation
}
```

<!-- prettier-ignore -->
```scss
$bar: 10px; // Non-string value
$baz: 20px; // Non-string value

a {
  --foo: calc($bar + $baz); // ✗ Both variables require interpolation
}
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
$var: 2rem; // Non-string value

a {
  --spacing: #{$var}; // ✓ Properly interpolated
}
```

<!-- prettier-ignore -->
```scss
$var: "2rem"; // String value

a {
  --spacing: #{$var}; // ✓ Properly interpolated
}
```

<!-- prettier-ignore -->
```scss
$primary: #007bff; // Non-string value
$secondary: #6c757d; // Non-string value

a {
  --color-primary: #{$primary}; // ✓ Properly interpolated
  --color-secondary: #{$secondary}; // ✓ Properly interpolated
}
```

<!-- prettier-ignore -->
```scss
$bar: 10px; // Non-string value
$baz: 20px; // Non-string value

a {
  --foo: calc(#{$bar} + #{$baz}); // ✓ Both variables properly interpolated
}
```

<!-- prettier-ignore -->
```scss
a {
  --foo: var(--bar); // ✓ CSS variable reference, not an SCSS variable
}
```

<!-- prettier-ignore -->
```scss
$var: 2rem; // Non-string value

a {
  padding: $var; // ✓ Not a custom property, no interpolation needed
}
```

<!-- prettier-ignore -->
```scss
$i: 5;

a {
  --scale: #{calculate-scale($i)}; // ✓ Variable already inside interpolation
}
```

## Further Reading

- [Sass Documentation: Interpolation](https://sass-lang.com/documentation/interpolation)
- [Sass Documentation: Custom Properties](https://sass-lang.com/documentation/style-rules/declarations/#custom-properties)