import { describe, expect, it } from "@jest/globals"
import path from "path"
import stylelint, { type LinterResult } from "stylelint"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pluginPath = path.join(__dirname, "scss-custom-property-interpolation.js")

const config = {
  plugins: [pluginPath],
  rules: {
    "custom/scss-custom-property-interpolation": true,
  },
}

async function lintScss(code: string) {
  const result: LinterResult = await stylelint.lint({
    code,
    config,
    formatter: "json",
  })

  return result.results[0]
}

describe("custom/scss-custom-property-interpolation", () => {
  describe("should report violations", () => {
    const testCases = [
      {
        name: "simple custom property with variable",
        code: ".foo { --size: $base-margin; }",
        expectedMessage: "#{$base-margin}",
      },
      {
        name: "custom property with calc and variable",
        code: ".foo { --size: calc(100% - $base-margin); }",
        expectedMessage: "#{$base-margin}",
      },
      {
        name: "custom property with CSS var and SCSS variable",
        code: ".foo { --size: calc(var(--base) / $font-scale); }",
        expectedMessage: "#{$font-scale}",
      },
      {
        name: "multiple SCSS variables in one custom property",
        code: ".foo { --size: calc($var1 + $var2); }",
        expectedMessage: "#{$var1}",
      },
      {
        name: "variable with hyphen in custom property",
        code: ".foo { --width: $base-width; }",
        expectedMessage: "#{$base-width}",
      },
      {
        name: "variable with underscore in custom property",
        code: ".foo { --width: $base_width; }",
        expectedMessage: "#{$base_width}",
      },
    ]

    testCases.forEach(({ name, code, expectedMessage }) => {
      it(`should report violations: ${name}`, async () => {
        const result = await lintScss(code)

        expect(result.warnings.length).toBeGreaterThan(0)
        expect(result.warnings[0].rule).toBe("custom/scss-custom-property-interpolation")
        expect(result.warnings[0].text).toContain(expectedMessage)
      })
    })
  })

  describe("should not report violations", () => {
    const testCases = [
      {
        name: "properly interpolated variable in custom property",
        code: ".foo { --size: #{$base-margin}; }",
      },
      {
        name: "properly interpolated variable in calc within custom property",
        code: ".foo { --size: calc(0.5 * #{$base-margin}); }",
      },
      {
        name: "custom property with only CSS var",
        code: ".foo { --size: var(--base-margin); }",
      },
      {
        name: "custom property with plain values",
        code: ".foo { --size: 20px; }",
      },
      {
        name: "multiple properly interpolated variables in custom property",
        code: ".foo { --size: calc(#{$var1} + #{$var2}); }",
      },
      {
        name: "regular property with SCSS variable (not custom property)",
        code: ".foo { margin: $base-margin; }",
      },
      {
        name: "regular property with calc and SCSS variable (not custom property)",
        code: ".foo { margin: calc(100% - $base-margin); }",
      },
      {
        name: "variable inside interpolation block",
        code: ".foo { --size: #{abs($i)}; }",
      },
      {
        name: "variable inside function call within interpolation block",
        code: ".foo { --font-size: #{calculate-scale($i)}; }",
      },
      {
        name: "multiple interpolation blocks with variables",
        code: ".foo { --size: #{abs($i)} #{other($j)}; }",
      },
      {
        name: "nested functions with variable in interpolation block",
        code: ".foo { --size: #{max(abs($i), 10)}; }",
      },
      {
        name: "variable in interpolation block mixed with plain variable",
        code: ".foo { --size: #{abs($i)}; }",
      },
    ]

    testCases.forEach(({ name, code }) => {
      it(`should not report violations: ${name}`, async () => {
        const result = await lintScss(code)

        const calcInterpolationWarnings = result.warnings.filter(
          (w) => w.rule === "custom/scss-custom-property-interpolation",
        )
        expect(calcInterpolationWarnings.length).toBe(0)
      })
    })
  })

  describe("should autofix", () => {
    const testCases = [
      {
        name: "simple variable in custom property",
        input: ".foo { --size: $base-margin; }",
        expected: ".foo { --size: #{$base-margin}; }",
      },
      {
        name: "variable with arithmetic in custom property",
        input: ".foo { --size: calc(0.5 * $base-margin); }",
        expected: ".foo { --size: calc(0.5 * #{$base-margin}); }",
      },
      {
        name: "multiple variables in custom property",
        input: ".foo { --size: calc($a + $b); }",
        expected: ".foo { --size: calc(#{$a} + #{$b}); }",
      },
      {
        name: "CSS var with SCSS variable",
        input: ".foo { --size: calc(var(--base) / $factor); }",
        expected: ".foo { --size: calc(var(--base) / #{$factor}); }",
      },
      {
        name: "variable with spaces in custom property",
        input: ".foo { --size: calc( $base-margin ); }",
        expected: ".foo { --size: calc( #{$base-margin} ); }",
      },
    ]

    testCases.forEach(({ name, input, expected }) => {
      it(`should autofix: ${name}`, async () => {
        const result = await stylelint.lint({
          code: input,
          config,
          fix: true,
        })

        expect(result.code).toBe(expected)
      })
    })
  })

  it("should not modify already interpolated variables in custom properties", async () => {
    const code = ".foo { --size: calc(0.5 * #{$base-margin}); }"
    const result = await stylelint.lint({
      code,
      config,
      fix: true,
    })

    expect(result.code).toBe(code)
  })

  it("should not check regular properties (non-custom properties)", async () => {
    const code = ".foo { margin: calc($base-margin); }"
    const result = await lintScss(code)

    const warnings = result.warnings.filter(
      (w) => w.rule === "custom/scss-custom-property-interpolation",
    )
    expect(warnings.length).toBe(0)
  })

  describe("interpolation block detection", () => {
    it("should not flag variables inside interpolation blocks", async () => {
      const code = ".foo { --font-size-minus: #{abs($i)}; }"
      const result = await lintScss(code)

      const warnings = result.warnings.filter(
        (w) => w.rule === "custom/scss-custom-property-interpolation",
      )
      expect(warnings.length).toBe(0)
    })

    it("should not flag variables in function calls inside interpolation blocks", async () => {
      const code = ".foo { --font-size: #{calculate-scale($index)}; }"
      const result = await lintScss(code)

      const warnings = result.warnings.filter(
        (w) => w.rule === "custom/scss-custom-property-interpolation",
      )
      expect(warnings.length).toBe(0)
    })

    it("should flag variables outside interpolation blocks but not inside", async () => {
      const code = ".foo { --size: $naked-var #{interpolated($wrapped-var)}; }"
      const result = await lintScss(code)

      expect(result.warnings.length).toBe(1)
      expect(result.warnings[0].text).toContain("$naked-var")
      expect(result.warnings[0].text).not.toContain("$wrapped-var")
    })

    it("should handle multiple nested interpolation blocks", async () => {
      const code = ".foo { --size: #{outer(#{inner($var)})}; }"
      const result = await lintScss(code)

      const warnings = result.warnings.filter(
        (w) => w.rule === "custom/scss-custom-property-interpolation",
      )
      expect(warnings.length).toBe(0)
    })

    it("should autofix only variables outside interpolation blocks", async () => {
      const input = ".foo { --size: $naked #{wrapped($inside)}; }"
      const result = await stylelint.lint({
        code: input,
        config,
        fix: true,
      })

      const expected = ".foo { --size: #{$naked} #{wrapped($inside)}; }"
      expect(result.code).toBe(expected)
    })

    it("should handle real-world @for loop case", async () => {
      const code = `
        @for $i from -3 through -1 {
          --font-size-minus-#{abs($i)}: #{calculate-scale($i)};
        }
      `
      const result = await lintScss(code)

      const warnings = result.warnings.filter(
        (w) => w.rule === "custom/scss-custom-property-interpolation",
      )
      expect(warnings.length).toBe(0)
    })
  })
})
