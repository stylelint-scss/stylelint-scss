# at-mixin-no-risky-nesting-selector

Disallow risky nesting selectors within a mixin.

If a mixin contains a parent selector within another style rule, and is used in a nested context, 
the output selector may include the outermost parent selector in an unexpected way.

In this example:
```scss
@mixin foo {
  .a {
    color: blue;
    .b & {
      color: red;
    }
  }
}

.c {
  @include foo;
}
```

The user may expect `.c` to go outside all selectors in `foo`:
`.c .b .a {...}`

But this outputs:
```scss
.c .a {
  color: blue;
}
.b .c .a {
  color: red;
}
```

However, if we pull the parent selector into the child and make the child style rule a sibling:
```scss
@mixin foo {
  .a {
    color: blue;
  }
  .b .a {
    color: red;
  }
}

.c {
  @include foo;
}
```

It outputs:
```scss
.c .a {
  color: blue;
}
.c .b .a {
  color: red;
}
```

This only occurs when a parent selector meets all of the following conditions:
- Is within a `@mixin` rule.
- Is nested within another style rule.
- Is not positioned at the beginning of a complex selector.

## Options

### `true`

The following patterns are considered warnings:

```scss
@mixin foo {
  .bar {
    color: blue;
    .baz & {
      color: red;
    }
  }
}
```

```scss
@mixin foo {
  .bar {
    color: blue;
    .qux, .baz & .quux{
      color: red;
    }
  }
}
```

The following patterns are _not_ considered warnings:

```scss
.foo {
  .bar {
    color: blue;
    .baz & {
      color: red;
    }
  }
}
```

```scss
@mixin foo {
  .bar {
    color: blue;
    & .baz {
      color: red;
    }
  }
}
```

```scss
.bar {
  color: blue;
  .baz & {
    color: red;
  }
}
```

```scss
.foo {
  color: blue;
  & .bar, .baz & .qux {
    color: red;
  }
}
```

```scss
@mixin foo {
  .baz & {
    color: red;
  }
}
```