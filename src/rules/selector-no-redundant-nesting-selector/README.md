# selector-no-redundant-nesting-selector

Disallow redundant nesting selectors (`&`).

```scss
p {
  & a {}
//↑
// This type of selector
}
```

The following patterns are considered warnings:

```scss
p {
  & a {}
}
```

```scss
p {
  & > a {}
}
```

```scss
p {
  & .class {}
}
```

```scss
p {
  & + .foo {}
}
```

The following patterns are *not* considered warnings:

```scss
p {
  &.foo {}
}
```

```scss
p {
  .foo > & {}
}
```

```scss
p {
  &,
  .foo,
  .bar {
    margin: 0;
  }
}
```

## Options

Some false alarms can be blocked by assigning keywords:

```js
{
  rules: {
    'scss/selector-no-redundant-nesting-selector', [true, { keywords: ['when'] }],
  },
}
```

The following patterns are *not* considered warnings:

```less
 @theme: ~'dark';
p {
  & when (@theme = dark) {

  }
  & when not(@theme = dark) {

  }
}
```

```js
{
  rules: {
    'scss/selector-no-redundant-nesting-selector', true,
  },
}
```

The following patterns are considered warnings:

```less
 @theme: ~'dark';
p {
  & when (@theme = dark) {
    
  }
  & when not(@theme = dark) {

  }
}
```