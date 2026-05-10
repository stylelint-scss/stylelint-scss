const singleArgumentMathFunctions = new Set([
  "abs",
  "acos",
  "asin",
  "atan",
  "calc",
  "cos",
  "exp",
  "sign",
  "sin",
  "sqrt",
  "tan"
]);

const mathFunctions = new Set([
  ...singleArgumentMathFunctions,
  "atan2",
  "calc-size",
  "clamp",
  "hypot",
  "log",
  "max",
  "min",
  "mod",
  "pow",
  "rem",
  "round"
]);

export const atRuleRegexes = {
  propertyName: /^property$/i
};

export const mayIncludeRegexes = {
  mathFunction: new RegExp(
    `\\b(?:${[...mathFunctions.values()].join("|")})\\(`,
    "i"
  )
};
