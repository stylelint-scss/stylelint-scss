/**
 * @see https://sass-lang.com/documentation/modules#global-functions
 */
export const GLOBAL_FUNCTIONS = Object.freeze([
  "hsl",
  "hsla",
  "if",
  "rgb",
  "rgba"
]);

/**
 * @see https://sass-lang.com/documentation/modules/color
 */
export const COLOR_FUNCTIONS = Object.freeze([
  "adjust-color",
  "adjust-hue",
  "alpha",
  "blackness",
  "blue",
  "change-color",
  "complement",
  "darken",
  "desaturate",
  "fade-in",
  "fade-out",
  "grayscale",
  "green",
  "hue",
  "ie-hex-str",
  "invert",
  "lighten",
  "lightness",
  "mix",
  "opacity",
  "red",
  "saturate",
  "saturation",
  "scale-color",
  "transparentize",

  // with namespace
  "color.adjust",
  "color.alpha",
  "color.blackness",
  "color.blue",
  "color.change",
  "color.complement",
  "color.grayscale",
  "color.green",
  "color.hue",
  "color.hwb",
  "color.ie-hex-str",
  "color.invert",
  "color.lightness",
  "color.mix",
  "color.red",
  "color.saturation",
  "color.scale",
  "color.whiteness"
]);

/**
 * @see https://sass-lang.com/documentation/modules/list
 */
export const LIST_FUNCTIONS = Object.freeze([
  "append",
  "index",
  "is-bracketed",
  "join",
  "length",
  "list-separator",
  "nth",
  "set-nth",
  "list.zip",

  // with namespace
  "list.append",
  "list.index",
  "list.is-bracketed",
  "list.join",
  "list.length",
  "list.nth",
  "list.separator",
  "list.set-nth",
  "list.slash",
  "zip"
]);

/**
 * @see https://sass-lang.com/documentation/modules/map
 */
export const MAP_FUNCTIONS = Object.freeze([
  "map-get",
  "map-has-key",
  "map-keys",
  "map-merge",
  "map-remove",
  "map-values",

  // with namespace
  "map.deep-merge",
  "map.deep-remove",
  "map.get",
  "map.has-key",
  "map.keys",
  "map.merge",
  "map.remove",
  "map.set",
  "map.values"
]);

// TODO: Add other functions...

export const ALL_FUNCTIONS = Object.freeze([
  ...GLOBAL_FUNCTIONS,
  ...COLOR_FUNCTIONS,
  ...LIST_FUNCTIONS,
  ...MAP_FUNCTIONS
]);
