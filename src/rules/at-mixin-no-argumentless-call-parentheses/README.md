# at-mixin-no-argumentless-call-parentheses

Disallow parentheses in argumentless `@mixin` calls.

```scss
@include mixin-name() {
/**                ↑
 *  Such mixin calls */
```

The following patterns are considered warnings:

```scss
@include mixin-name() {
```

The following patterns are *not* considered warnings:

```scss
@include mixin-name {
```
