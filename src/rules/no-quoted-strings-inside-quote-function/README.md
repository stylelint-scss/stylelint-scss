# no-quoted-strings-inside-quote-function

Disallow quoted strings inside the quote function.

```scss
  p {
    font-family: quote("Helvetica");
/**                    ↑         ↑
 * These quotes are unnecessary
  }

```

## Options

### `true`

The following patterns are considered violations:

```scss
a {
  font-family: quote("Helvetica");
}
```

The following patterns are *not* considered violations:

```scss
a {
  color: quote(blue);
}
```
