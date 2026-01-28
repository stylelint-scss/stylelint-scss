import ruleUrl from "../ruleUrl.js";

test("returning a rule URL", () => {
  expect(ruleUrl("at-function-pattern")).toBe(
    "https://github.com/stylelint-scss/stylelint-scss/blob/master/src/rules/at-function-pattern"
  );
});

test("returning a rule URL removing the namespace", () => {
  expect(ruleUrl("scss/at-function-pattern")).toBe(
    "https://github.com/stylelint-scss/stylelint-scss/blob/master/src/rules/at-function-pattern"
  );
});
