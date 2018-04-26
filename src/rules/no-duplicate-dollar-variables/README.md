# no-duplicate-dollar-variables

Disallow duplicate dollar variables within a stylesheet.

```scss
    $a: 1;
    $a: 2;
/** ↑
 * These are duplicates */
```

## Options

### `true`

The following patterns are considered violations:

```scss
$a: 1;
$a: 2;
```

```scss
$a: 1;
$b: 2;
$a: 3;
```

```scss
$a: 1;
.b {
  $a: 1;
}
```

The following patterns are *not* considered violations:

```scss
$a: 1;
$b: 2;
```

```scss
$a: 1;
.b {
  $b: 2;
}
```
