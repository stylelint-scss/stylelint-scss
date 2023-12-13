import hasInterpolation from "../hasInterpolation.js";

it("hasInterpolation", () => {
  expect(hasInterpolation("(min-width#{$value}: 10px)")).toBeTruthy();
  expect(hasInterpolation("(@{value}min-width : 10px)")).toBeTruthy();
  expect(hasInterpolation("#{$Attr}-color")).toBeTruthy();
  expect(
    hasInterpolation(`
    #{color.adjust(
      $mdn-color-light-theme-yellow-30,
      $alpha: -0.6
    )}
    `)
  ).toBe(true);
  expect(hasInterpolation("@{Attr}-color")).toBeTruthy();
  expect(
    hasInterpolation(`
    @{color.adjust(
      $mdn-color-light-theme-yellow-30,
      $alpha: -0.6
    )}
  `)
  ).toBe(true);
  expect(
    hasInterpolation(`
    $(color.adjust(
      $mdn-color-light-theme-yellow-30,
      $alpha: -0.6
    ))
  `)
  ).toBe(true);
  expect(hasInterpolation("#{50% - $n}")).toBeTruthy();
  expect(hasInterpolation(".n-#{$n}")).toBeTruthy();
  expect(hasInterpolation(":n-#{$n}")).toBeTruthy();
  expect(hasInterpolation(".n-@{n}")).toBeTruthy();
  expect(hasInterpolation("(min-width: 10px)")).toBeFalsy();
  expect(hasInterpolation(".a{}")).toBeFalsy();
  expect(hasInterpolation("$sass-variable + 'foo'")).toBeFalsy();
  expect(hasInterpolation("10px")).toBeFalsy();
  expect(hasInterpolation("@less-variable + 'foo'")).toBeFalsy();
});
