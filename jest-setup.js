import { getTestRule } from "jest-preset-stylelint";

import plugin from "./src/index.js";

global.testRule = getTestRule({ plugins: [plugin] });

// Inspired by https://www.npmjs.com/package/dedent-tag
global.dedent = function dedent(strings) {
  return strings[0]
    .replace(/^[ \t]+/gm, "") // remove indentation
    .replace(/^\s*\n/gm, ""); // remove empty lines
};
