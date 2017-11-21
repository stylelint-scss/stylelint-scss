# at-function-named-arguments

Require named parameters in SCSS function call rule.

```scss
animation: animation($duration: 250ms) {
//                 ↑
// Require or disallow this
```

## Options

`string`: `"always"|"never"|"always-multiple-arguments"`

### `always`

The following patterns are considered warnings:

```scss
.foo {
  animation: animation(250ms, 100ms, infinite);
} 
```

```scss
.foo {
  animation: animation(250ms);
} 
```

```scss
.foo {
  border: reset($value: 20, 'bar', $color: #FFF);
}
```

The following patterns are *not* considered warnings:

```scss
.foo {
  animation: animation($duration: 250ms);
}
```

```scss
.foo {
  animation: animation($duration: 250ms, $delay: 100ms, $direction: infinite);
}
```

### `never`

The following patterns are considered warnings:

```scss
.foo {
  border: reset($value: 20);
}
```

```scss
.foo {
  animation: animation($duration: 250ms, $delay: 100ms, $direction: infinite);
}
```

```scss
.foo {
  border: reset($value: 20, 'bar', $color: #FFF);
}
```

The following patterns are *not* considered warnings:

```scss
.foo {
  animation: animation(250ms, 100ms, infinite);
} 
```

### `always-multiple-arguments`

The following patterns are considered warnings:

```scss
.foo {
  animation: animation(250ms, 100ms, infinite);
}
```

```scss
.foo {
  border: reset($value: 20, 'bar', $color: #FFF);
}
```

```scss
.foo {
  animation: animation($duration: 250ms);
}
```

The following patterns are *not* considered warnings:

```scss
.foo {
  animation: animation($duration: 250ms, $delay: 100ms, $direction: infinite);
}
```

```scss
.foo {
  border: reset(20);
}
```
