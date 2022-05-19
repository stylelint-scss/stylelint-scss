# at-rule-conditional-no-parentheses

Disallow parentheses in conditional @ rules (if, elsif, while)

```css
    @if (true) {}
/**     ↑    ↑
 * Get rid of parentheses like this. */
```

The [`fix` option](https://stylelint.io/user-guide/usage/options#fix) can automatically fix all of the problems reported by this rule.

## Options

### `true`

The following patterns are considered warnings:

```scss
@if(true)
```

```scss
@else if(true)
```

```scss
@while(true)
```

The following patterns are *not* considered warnings:

```scss
@if true
```

```scss
@else if true
```

```scss
@while true
```
