# function-quote-no-quoted-strings-inside

Disallow quoted strings inside the [quote function](https://sass-lang.com/documentation/functions/string#quote)

```scss
p {
   color: saturate(blue, 20%);
  /**     ↑      ↑
   * This function should be scalar-color
   */
}
```

## Options

### `true`

The following patterns are considered violations:

```scss
p {
   color: saturate(blue, 20%);
}
```

```scss
p {
   color: desaturate(blue, 20%);
}
```

```scss
p {
   color: darken(blue, .2);
}
```

```scss
p {
   color: lighten(blue, .2);
}
```

```scss
p {
   color: opacify(blue, .2);
}
```

```scss
p {
   color: fade-in(blue, .2);
}
```

```scss
p {
   color: transparentize(blue, .2);
}
```

```scss
p {
   color: fade-out(blue, .2);
}
```

The following patterns are _not_ considered violations:

```scss
 p {
   color: scale-color(blue, $alpha: -40%);
 }
```