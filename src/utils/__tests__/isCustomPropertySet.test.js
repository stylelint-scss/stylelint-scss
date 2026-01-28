import isCustomPropertySet from "../isCustomPropertySet.js";
import postcss from "postcss";

describe("isCustomPropertySet", () => {
  it("accepts custom property set", () => {
    customPropertySet("--foo: {};", parsedNode => {
      expect(isCustomPropertySet(parsedNode)).toBeTruthy();
    });
  });

  it("rejects custom property", () => {
    customPropertySet("--foo: red;", parsedNode => {
      expect(isCustomPropertySet(parsedNode)).toBeFalsy();
    });
  });

  function customPropertySet(css, cb) {
    postcss.parse(css).walk(cb);
  }
});
