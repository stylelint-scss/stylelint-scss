import postcss from "postcss";
import { moduleNamespace } from "../moduleNamespace";

describe("moduleNamespace", () => {
  it("should return 'map' when module import was not found", () => {
    expect(getModuleNamespace("@use 'sass:color';", "sass:map")).toBe("map");
  });

  it("should return 'map' on default namespace", () => {
    expect(getModuleNamespace("@use 'sass:map';", "sass:map")).toBe("map");
  });

  it("should return 'map' on default namespace using 'with'", () => {
    expect(getModuleNamespace("@use 'sass:map' with ();", "sass:map")).toBe(
      "map"
    );
  });

  it("should return 'map' on default namespace using 'with' (with multiple spaces)", () => {
    expect(getModuleNamespace("@use  'sass:map'  with  ();", "sass:map")).toBe(
      "map"
    );
  });

  it("should return null on no namespace", () => {
    expect(getModuleNamespace("@use 'sass:map' as *;", "sass:map")).toBeNull();
  });

  it("should return null on no namespace using 'with'", () => {
    expect(
      getModuleNamespace("@use 'sass:map' as * with ();", "sass:map")
    ).toBeNull();
  });

  it("should return null on no namespace using 'with' (with multiple spaces)", () => {
    expect(
      getModuleNamespace("@use  'sass:map'  as  *  with  ();", "sass:map")
    ).toBeNull();
  });

  it("should return null on no namespace using 'with' (without spaces)", () => {
    expect(
      getModuleNamespace("@use 'sass:map'as*with ();", "sass:map")
    ).toBeNull();
  });

  it("should return null on no namespace using 'with' (without spaces, with line breaks)", () => {
    expect(
      getModuleNamespace("@use\n'sass:map'\nas\n*\nwith\n();", "sass:map")
    ).toBeNull();
  });

  it("should return null on no namespace using 'with' (with multiple spaces, with line breaks)", () => {
    expect(
      getModuleNamespace(
        "@use  \n  'sass:map'  \n  as  \n  *  \n  with  \n  ();",
        "sass:map"
      )
    ).toBeNull();
  });

  it("should return 'ns' on custom namespace", () => {
    expect(getModuleNamespace("@use 'sass:map' as ns;", "sass:map")).toBe("ns");
  });

  it("should return 'ns' on custom namespace using 'with'", () => {
    expect(
      getModuleNamespace("@use 'sass:map' as ns with ();", "sass:map")
    ).toBe("ns");
  });

  it("should return 'ns' on custom namespace using 'with' (with multiple spaces)", () => {
    expect(
      getModuleNamespace("@use  'sass:map'  as  ns  with  ();", "sass:map")
    ).toBe("ns");
  });

  it("should return 'ns' on custom namespace using 'with' (with multiple spaces, with line breaks)", () => {
    expect(
      getModuleNamespace(
        "@use  \n \n  'sass:map'  \n \n  as  \n \n  ns  \n \n  with  \n \n  ();",
        "sass:map"
      )
    ).toBe("ns");
  });

  it("should return 'custom-module' when module import is 'custom-module'", () => {
    expect(getModuleNamespace("@use 'custom-module';", "custom-module")).toBe(
      "custom-module"
    );
  });

  it("should return 'custom-module' when module import is 'custom-module' using 'with'", () => {
    expect(
      getModuleNamespace("@use 'custom-module' with ();", "custom-module")
    ).toBe("custom-module");
  });

  it("should return 'custom-module' when module import is 'custom-module.scss'", () => {
    expect(
      getModuleNamespace("@use 'custom-module.scss';", "custom-module.scss")
    ).toBe("custom-module");
  });

  it("should return 'custom-module' when module import is 'custom-module.scss' using 'with'", () => {
    expect(
      getModuleNamespace(
        "@use 'custom-module.scss' with ();",
        "custom-module.scss"
      )
    ).toBe("custom-module");
  });

  it("should return 'custom-module' when module import is 'path/to/custom-module'", () => {
    expect(
      getModuleNamespace(
        "@use 'path/to/custom-module';",
        "path/to/custom-module"
      )
    ).toBe("custom-module");
  });

  it("should return 'custom-module' when module import is 'path/to/custom-module' using with ()", () => {
    expect(
      getModuleNamespace(
        "@use 'path/to/custom-module' with ();",
        "path/to/custom-module"
      )
    ).toBe("custom-module");
  });

  it("should return 'custom-module' when module import is 'path/to/custom-module.scss'", () => {
    expect(
      getModuleNamespace(
        "@use 'path/to/custom-module.scss';",
        "path/to/custom-module.scss"
      )
    ).toBe("custom-module");
  });

  it("should return 'custom-module' when module import is 'path/to/custom-module.scss' using 'with'", () => {
    expect(
      getModuleNamespace(
        "@use 'path/to/custom-module.scss' with ();",
        "path/to/custom-module.scss"
      )
    ).toBe("custom-module");
  });

  it("should return `null` on no namespace when module import is 'custom-module'", () => {
    expect(
      getModuleNamespace("@use 'custom-module' as *;", "custom-module")
    ).toBeNull();
  });

  it("should return `null` on no namespace when module import is 'custom-module' using 'with'", () => {
    expect(
      getModuleNamespace("@use 'custom-module' as * with ();", "custom-module")
    ).toBeNull();
  });

  it("should return 'ns' on custom namespace when module import is 'custom-module'", () => {
    expect(
      getModuleNamespace("@use 'custom-module' as ns;", "custom-module")
    ).toBe("ns");
  });

  it("should return 'ns' on custom namespace when module import is 'custom-module' using 'with'", () => {
    expect(
      getModuleNamespace("@use 'custom-module' as ns with ();", "custom-module")
    ).toBe("ns");
  });
});

function getModuleNamespace(css, module) {
  const root = postcss.parse(css);

  return moduleNamespace(root, module);
}
