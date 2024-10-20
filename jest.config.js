/** @satisfies {import('jest').Config} */
const config = {
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
  setupFiles: ["<rootDir>/jest-setup.js"],
  runner: "jest-light-runner",
  testEnvironment: "node",
  roots: ["src"],
  testRegex: ".*\\.test\\.js$|src/.*/__tests__/.*\\.js$"
};

export default config;
