# dollar-variable-pattern

Specify a pattern for Sass-like variables.

```scss
a { $foo: 1px; }
/** ↑
 * The pattern of this */
```

## Options

`regex` or `string`

A string will be translated into a RegExp like so `new RegExp(yourString)` — so be sure to escape properly.

### E.g. `/foo-.+/`

The following patterns are considered warnings:

```scss
a { $boo-bar: 0; }
```

The following patterns are *not* considered warnings:

```scss
a { $foo-bar: 0; }
```
