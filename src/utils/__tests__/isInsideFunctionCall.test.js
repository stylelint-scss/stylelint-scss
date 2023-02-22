import { isInsideFunctionCall } from "../sassValueParser";

describe("isInsideFunctionCall", () => {
  it("should handle operators/signs inside url functions", () => {
    const urlFunctions = [
      {
        string: "url(../../img/build/svg/arrow-11-down-dark.svg)",
        index: 13
      },
      {
        string: "url(../../img/build/svg/arrow-#{$i + 2}-down-dark.svg)",
        index: 13
      },
      {
        string: "url(https://99-0a.x.y.rackcdn.com/z.jpg)",
        index: 11
      },
      {
        string:
          "url(../../img/build/svg/arrow-11-down-dark.svg), url(../../img/build/svg/arrow-11-down-dark.svg)",
        index: 13
      },
      {
        string:
          "url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i / 2}-down-dark.svg)",
        index: 14
      },
      {
        string: "url(../../img/build/svg/arrow-#{$i /2}-down-dark.svg)",
        index: 13
      },
      {
        string:
          "url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i * 2}-down-dark.svg)",
        index: 14
      },
      {
        string:
          "url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i % 2}-down-dark.svg)",
        index: 14
      },
      {
        string:
          "url(https://99-0a.x.y.rackcdn.com/img/build/svg/arrow-#{$i %2}-down-dark.svg)",
        index: 59
      }
    ];

    urlFunctions.forEach(test => {
      expect(isInsideFunctionCall(test.string, test.index).fn).toBe("url");
    });
  });

  it("should handle operators/signs inside translate function", () => {
    expect(
      isInsideFunctionCall("translate(-50%, -$no-ui-slider-height)", 16).fn
    ).toBe("translate");
  });

  it("should handle operators/signs that are interpolated", () => {
    expect(isInsideFunctionCall("#{math.acos(0.7-0.5)}", 15).fn).toBe("acos");
    expect(
      isInsideFunctionCall("#{scale-color(#fff, $lightness: -75%)}", 32).fn
    ).toBe("scale-color");
  });

  it("should handle nested functions", () => {
    expect(isInsideFunctionCall("selector(:has(*))", 14).fn).toBe(":has");
  });
});
