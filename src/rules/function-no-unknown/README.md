# function-no-unknown

Disallow unknown functions. Should be used **instead of** Stylelint's [function-no-unknown](https://stylelint.io/user-guide/rules/function-no-unknown).

```css
a { color: unknown(1); }
/**        ↑
 * Functions like this */
```

This rule is basically a wrapper around the mentioned core rule. You must disable Stylelint's core rule to make this rule work:

```json
{
  "rules": {
    "function-no-unknown": null,
    "scss/function-no-unknown": true
  }
}
```

## Options

### `true`

The following patterns are considered warnings:

```css
a { color: unknown(1); }
```

The following patterns are *not* considered warnings:

```css
a { color: hsl(240 100% 50%); }
```

```css
a { color: if(true, green, red); }
```

## Optional secondary options

### `ignoreFunctions: ["/regex/", /regex/, "non-regex"]`

Given:

```json
["/^my-/i", "foo"]
```

The following patterns are *not* considered warnings:

```css
a { color: my-func(1); }
```

```css
a { color: MY-FUNC(1); }
```

```css
a { color: foo(1); }
```
