import stylelintConfig from "eslint-config-stylelint";
import stylelintJestConfig from "eslint-config-stylelint/jest";

export default [
  ...stylelintConfig,
  ...stylelintJestConfig,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        dedent: "readonly",
        testRule: "readonly",
        testRuleConfigs: "readonly"
      },
      sourceType: "module"
    }
  }
];
