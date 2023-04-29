"use strict";

module.exports = {
  preset: "jest-preset-stylelint",
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.js"],
  coverageDirectory: "./.coverage/",
  coverageReporters: ["html", "lcov", "text"],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  setupFiles: ["./jest-setup.js"],
  testEnvironment: "node",
  roots: ["src"],
  testRegex: ".*\\.test\\.js$|src/.*/__tests__/.*\\.js$"
};
