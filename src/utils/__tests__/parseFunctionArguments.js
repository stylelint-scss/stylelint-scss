import {
  groupByKeyValue,
  mapToKeyValue,
  parseFunctionArguments
} from "../parseFunctionArguments.js";

describe("groupByKeyValue", () => {
  it("should group key with values", () => {
    expect(
      groupByKeyValue([
        { type: "word", sourceIndex: 6, value: "$value" },
        {
          type: "div",
          sourceIndex: 12,
          value: ":",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 14, value: "40px" },
        {
          type: "div",
          sourceIndex: 18,
          value: ",",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 20, value: "10px" }
      ])
    ).toEqual([
      [
        { sourceIndex: 6, type: "word", value: "$value" },
        { after: " ", before: "", sourceIndex: 12, type: "div", value: ":" },
        { sourceIndex: 14, type: "word", value: "40px" }
      ],
      [{ sourceIndex: 20, type: "word", value: "10px" }]
    ]);
    expect(
      groupByKeyValue([
        { type: "word", sourceIndex: 6, value: "$value" },
        {
          type: "div",
          sourceIndex: 12,
          value: ":",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 14, value: "40px" },
        {
          type: "div",
          sourceIndex: 18,
          value: ",",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 20, value: "$second-value" },
        {
          type: "div",
          sourceIndex: 33,
          value: ":",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 35, value: "10px" },
        {
          type: "div",
          sourceIndex: 39,
          value: ",",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 41, value: "$color" },
        {
          type: "div",
          sourceIndex: 47,
          value: ":",
          before: "",
          after: " "
        },
        { type: "string", sourceIndex: 49, quote: "'", value: "black" }
      ])
    ).toEqual([
      [
        { sourceIndex: 6, type: "word", value: "$value" },
        { after: " ", before: "", sourceIndex: 12, type: "div", value: ":" },
        { sourceIndex: 14, type: "word", value: "40px" }
      ],
      [
        { sourceIndex: 20, type: "word", value: "$second-value" },
        { after: " ", before: "", sourceIndex: 33, type: "div", value: ":" },
        { sourceIndex: 35, type: "word", value: "10px" }
      ],
      [
        { sourceIndex: 41, type: "word", value: "$color" },
        { after: " ", before: "", sourceIndex: 47, type: "div", value: ":" },
        { quote: "'", sourceIndex: 49, type: "string", value: "black" }
      ]
    ]);
    expect(
      groupByKeyValue([
        { type: "word", sourceIndex: 6, value: "$value" },
        {
          type: "div",
          sourceIndex: 12,
          value: ":",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 14, value: "40px" },
        {
          type: "div",
          sourceIndex: 18,
          value: ",",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 20, value: "$second-value" },
        {
          type: "div",
          sourceIndex: 33,
          value: ":",
          before: "",
          after: " "
        },
        { type: "word", sourceIndex: 35, value: "10px" },
        {
          type: "div",
          sourceIndex: 39,
          value: ",",
          before: "",
          after: " "
        }
      ])
    ).toEqual([
      [
        { sourceIndex: 6, type: "word", value: "$value" },
        { after: " ", before: "", sourceIndex: 12, type: "div", value: ":" },
        { sourceIndex: 14, type: "word", value: "40px" }
      ],
      [
        { sourceIndex: 20, type: "word", value: "$second-value" },
        { after: " ", before: "", sourceIndex: 33, type: "div", value: ":" },
        { sourceIndex: 35, type: "word", value: "10px" }
      ]
    ]);
  });
});

describe("mapToKeyValue", () => {
  it("should create key and value", () => {
    expect(
      mapToKeyValue([
        { sourceIndex: 6, type: "word", value: "$value" },
        { after: " ", before: "", sourceIndex: 12, type: "div", value: ":" },
        { sourceIndex: 14, type: "word", value: "40px" }
      ])
    ).toEqual({ key: "$value", value: "40px", index: 6 });
    expect(
      mapToKeyValue([{ sourceIndex: 20, type: "word", value: "10px" }])
    ).toEqual({ value: "10px", index: 20 });
  });
});

describe("parseFunctionArguments", () => {
  it("ignores empty string", () => {
    expect(parseFunctionArguments("")).toEqual([]);
  });

  it("ignores value outside a function", () => {
    expect(parseFunctionArguments("1")).toEqual([]);
  });

  it("parses function call", () => {
    expect(parseFunctionArguments("func()")).toEqual([]);
  });

  it("parses number as the value", () => {
    expect(parseFunctionArguments("func(1)")).toEqual([
      {
        value: "1",
        index: 5,
        endIndex: 6
      }
    ]);
  });

  it("parses calculation as the value", () => {
    expect(parseFunctionArguments("func(30 * 25ms)")).toEqual([
      {
        value: "30 * 25ms",
        index: 5,
        endIndex: 14
      }
    ]);
  });

  it("parses multiple args", () => {
    expect(parseFunctionArguments("func(1, 2)")).toEqual([
      {
        value: "1",
        index: 5,
        endIndex: 6
      },
      {
        value: "2",
        index: 8,
        endIndex: 9
      }
    ]);
  });

  it("parses trailing commas", () => {
    expect(parseFunctionArguments("func(1, 2,)")).toEqual([
      {
        value: "1",
        index: 5,
        endIndex: 6
      },
      {
        value: "2",
        index: 8,
        endIndex: 9
      }
    ]);
  });

  it("parses variable as the key and a number as the value", () => {
    expect(parseFunctionArguments("func($var: 1)")).toEqual([
      {
        key: "$var",
        value: "1",
        index: 5,
        endIndex: 12
      }
    ]);
  });

  it("parses variable as the key and a CSS function as the value", () => {
    expect(
      parseFunctionArguments(
        'test($foo: url("data:image/svg+xml;charset=utf8,%3C"))'
      )
    ).toEqual([
      {
        key: "$foo",
        value: 'url("data:image/svg+xml;charset=utf8,%3C")',
        index: 5,
        endIndex: 53
      }
    ]);
  });

  it("parses variable as the key and interpolation as the value", () => {
    expect(parseFunctionArguments("reset($value: #{$other-value})")).toEqual([
      {
        key: "$value",
        value: "#{$other-value}",
        index: 6,
        endIndex: 29
      }
    ]);
  });

  it("parses variable as the key and a calculated value", () => {
    expect(parseFunctionArguments("anim($duration: 30 * 25ms)")).toEqual([
      {
        key: "$duration",
        value: "30 * 25ms",
        index: 5,
        endIndex: 25
      }
    ]);
  });

  it("parses 2 key value parameters", () => {
    expect(parseFunctionArguments("func($var: 1, $foo: bar)")).toEqual([
      {
        key: "$var",
        value: "1",
        index: 5,
        endIndex: 12
      },
      {
        key: `$foo`,
        value: "bar",
        index: 14,
        endIndex: 23
      }
    ]);
  });

  it("parses 2 key value parameters 2", () => {
    expect(
      parseFunctionArguments(
        "reset($value: 40px, $second-value: 10px, $color: 'black')"
      )
    ).toEqual([
      {
        key: "$value",
        value: "40px",
        index: 6,
        endIndex: 18
      },
      {
        key: "$second-value",
        value: "10px",
        index: 20,
        endIndex: 39
      },
      {
        key: "$color",
        value: "'black'",
        index: 41,
        endIndex: 56
      }
    ]);
  });

  it("parses linear-gradient", () => {
    expect(
      parseFunctionArguments(
        "linear-gradient(to left, #333, #333 50%, #eee 75%, #333 75%);"
      )
    ).toEqual([
      {
        value: "to left",
        index: 16,
        endIndex: 23
      },
      {
        value: "#333",
        index: 25,
        endIndex: 29
      },
      {
        value: "#333 50%",
        index: 31,
        endIndex: 39
      },
      {
        value: "#eee 75%",
        index: 41,
        endIndex: 49
      },
      {
        value: "#333 75%",
        index: 51,
        endIndex: 59
      }
    ]);
  });
});
