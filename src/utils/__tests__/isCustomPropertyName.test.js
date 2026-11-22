import { isCustomPropertyName } from "../isCustomPropertyName.js";

describe("isCustomPropertyName", () => {
  it("returns true for custom properties", () => {
    expect(isCustomPropertyName("--foo")).toBe(true);
    expect(isCustomPropertyName("--foo-bar")).toBe(true);
  });

  it("returns false for other properties", () => {
    expect(isCustomPropertyName("color")).toBe(false);
    expect(isCustomPropertyName("-webkit-appearance")).toBe(false);
    expect(isCustomPropertyName("$foo")).toBe(false);
  });
});
