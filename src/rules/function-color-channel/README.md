# function-color-channel

Encourage the use of the [color.channel](https://sass-lang.com/documentation/modules/color#channel) function over related deprecated color functions:

- [color.alpha](https://sass-lang.com/documentation/modules/color#alpha) / [alpha](https://sass-lang.com/documentation/modules/color#alpha) / [opacity](https://sass-lang.com/documentation/modules/color#opacity)
- [color.blackness](https://sass-lang.com/documentation/modules/color#blackness) / [blackness](https://sass-lang.com/documentation/modules/color#blackness)
- [color.blue](https://sass-lang.com/documentation/modules/color#blue) / [blue](https://sass-lang.com/documentation/modules/color#blue)
- [color.green](https://sass-lang.com/documentation/modules/color#green) / [green](https://sass-lang.com/documentation/modules/color#green)
- [color.hue](https://sass-lang.com/documentation/modules/color#hue) / [hue](https://sass-lang.com/documentation/modules/color#hue)
- [color.lightness](https://sass-lang.com/documentation/modules/color#lightness) / [lightness](https://sass-lang.com/documentation/modules/color#lightness)
- [color.red](https://sass-lang.com/documentation/modules/color#red) / [red](https://sass-lang.com/documentation/modules/color#red)
- [color.saturation](https://sass-lang.com/documentation/modules/color#saturation) / [saturation](https://sass-lang.com/documentation/modules/color#saturation)
- [color.whiteness](https://sass-lang.com/documentation/modules/color#whiteness)

```scss
p {
  opacity: opacity(rgb(210, 225, 221, 0.4));
  /**      ↑     ↑
   * This function should be color.channel
   */
}
```

## Options

### `true`

The following patterns are considered violations:

```scss
@use "sass:color";
p {
  opacity: color.alpha(rgb(210, 225, 221, 0.4));
  opacity: alpha(#abcdef80);
  opacity: opacity($my-color);
}
```

The following patterns are _not_ considered violations:

```scss
p {
  opacity: color.channel(rgb(210, 225, 221, 0.4), "alpha");
}
```
