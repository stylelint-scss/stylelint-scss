/**
 * @see https://sass-lang.com/documentation/modules#global-functions
 */
export const GLOBAL_FUNCTIONS = Object.freeze(["if"]);

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
  "hue",
  "hwb",
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
  "transparentize"
]);

// TODO: Add other functions...

export const ALL_FUNCTIONS = Object.freeze([
  ...GLOBAL_FUNCTIONS,
  ...COLOR_FUNCTIONS
]);
