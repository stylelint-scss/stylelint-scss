"use strict";

const getTestRule = require("jest-preset-stylelint/getTestRule");

global.testRule = getTestRule({ plugins: ["./src"] });

// Inspired by https://www.npmjs.com/package/dedent-tag
global.dedent = function dedent(strings) {
  return strings[0]
    .replace(/^[ \t]+/gm, "") // remove indentation
    .replace(/^\s*\n/gm, ""); // remove empty lines
};
