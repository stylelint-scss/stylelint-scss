import postcss from "postcss";
import { moduleNamespace } from "../moduleNamespace";

describe("moduleNamespace", () => {
  it("should return null when module import was not found", () => {
    expect(getModuleNamespace("@use 'sass:color';", "sass:map")).toBeNull();
  });

  it("should return null on default namespace", () => {
    expect(getModuleNamespace("@use 'sass:map';", "sass:map")).toBeNull();
  });

  it("should return '*' on no namespace", () => {
    expect(getModuleNamespace("@use 'sass:map' as *;", "sass:map")).toBe("*");
  });

  it("should return 'ns' on custom namespace", () => {
    expect(getModuleNamespace("@use 'sass:map' as ns;", "sass:map")).toBe("ns");
  });
});

function getModuleNamespace(css, module) {
  const root = postcss.parse(css);

  return moduleNamespace(root, module);
}
