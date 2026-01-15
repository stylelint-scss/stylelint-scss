import rules from "../index.js";

const ruleEntries = Object.entries(rules);

test("not empty", () => {
  expect(ruleEntries.length).toBeGreaterThan(0);
});

for (const [ruleName, rulePromise] of ruleEntries) {
  const rule = await rulePromise;

  test(`"${ruleName}" is a function`, () => {
    expect(rule).toBeInstanceOf(Function);
  });

  test(`"${ruleName}" has the "ruleName" property`, () => {
    expect(rule).toHaveProperty("ruleName", expect.stringMatching(ruleName));
  });

  test(`"${ruleName}" has the "messages" property`, () => {
    expect(rule).toHaveProperty("messages", expect.any(Object));
  });

  test(`"${ruleName}" has the "meta" property`, () => {
    expect(rule).toHaveProperty("meta", expect.any(Object));
    expect(rule).toHaveProperty("meta.url", expect.stringMatching(ruleName));
  });
}
