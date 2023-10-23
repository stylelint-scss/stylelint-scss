# block-no-redundant-nesting

Disallow nesting a single block if it could be merged with its parent block.

```scss
.foo {
  .bar {}
}
```

[Sass official docs on nested properties](https://sass-lang.com/documentation/style-rules/declarations#nesting).

## Options

### `true`

The following patterns are considered warnings:

```scss
.foo {
  .bar {}
}
```

```scss
.foo {
  &-bar {
    &-baz {
      color: red;
    }
  }
}
```

The following patterns are *not* considered warnings:

```scss
.foo .bar {}
```

```scss
.foo-bar-baz {
  color: red;
}
```

```scss
// multiple child blocks
.foo {
  .bar {}
  &-baz {}
}
```

```scss
// parent or child with selector list
.foo {
  .bar, .baz {}
}

.foo, .bar {
  &-baz {}
}
```
