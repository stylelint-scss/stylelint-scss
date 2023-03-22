# calc-variable-interpolation

Disallow Sass variables that are used without interpolation with calc() CSS function.

```scss
--border-width: 5px;
$var: var(--border-width);

.class {
  border-top: calc($var * 2) solid red;
//                 ↑
// This variable needs to be interpolated
// because its value is a var() in node sass it does not compile.
}
```
