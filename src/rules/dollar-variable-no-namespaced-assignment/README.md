# dollar-variable-no-namespaced-assignment

Disallow assignment to namespaced variables. 

```scss
a { imported.$foo: 1px; }
/** ↑
 * This assignment */
```

## Examples

The following patterns are considered warnings:

```scss
imported.$foo: 1;
```

The following patterns are *not* considered warnings:

```scss
a { b: imported.$foo-bar; }
a { $foo: 0; }
```
