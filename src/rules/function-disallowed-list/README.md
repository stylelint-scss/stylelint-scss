# function-disallowed-list

Specify a list of disallowed functions.

<!-- prettier-ignore -->
```css
a { margin-left: math.random(100); }
/**                   ↑
              * This function */
```

## Options

`array|string|regex`: `["array", "of", "unprefixed", /functions/, "regex"]|"function"|"/regex/"|/regex/`

If a string is surrounded with `"/"` (e.g. `"/^rgb/"`), it is interpreted as a regular expression.

Given:

```json
["random", /double/]
```

The following patterns are considered warnings:

<!-- prettier-ignore -->
```scss
a { margin-left: math.random(100); }
```

<!-- prettier-ignore -->
```scss
@function double($num) {@return $num * 2;}
a {
  margin-left: double($num);
}
```

<!-- prettier-ignore -->
```scss
@function random($num) {@return $num;}
a {
  margin-left: random($num);
}
```

<!-- prettier-ignore -->
```scss
a {
  @if math.random(100) > 50 { margin-left: 10px; }
}
```

<!-- prettier-ignore -->
```scss
@include min-width(math.random(100)) {
  a { margin-left: 10px; }
}
```

The following patterns are _not_ considered warnings:

<!-- prettier-ignore -->
```scss
a { margin-left: math.abs(100); }
```

<!-- prettier-ignore -->
```scss
@function timesTwo($num) {@return $num * 2;}
a {
  margin-left: timesTwo($num);
}
```
