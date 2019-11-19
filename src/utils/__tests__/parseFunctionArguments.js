"use strict";

const {
  groupByKeyValue,
  mapToKeyValue,
  parseFunctionArguments
} = require("../parseFunctionArguments");

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
  expect(
    mapToKeyValue([
      { sourceIndex: 6, type: "word", value: "$value" },
      { after: " ", before: "", sourceIndex: 12, type: "div", value: ":" },
      { sourceIndex: 14, type: "word", value: "40px" }
    ])
  ).toEqual({ key: "$value", value: "40px" });
  expect(
    mapToKeyValue([{ sourceIndex: 20, type: "word", value: "10px" }])
  ).toEqual({ value: "10px" });
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
        value: "1"
      }
    ]);
  });

  it("parses calculation as the value", () => {
    expect(parseFunctionArguments("func(30 * 25ms)")).toEqual([
      {
        value: "30 * 25ms"
      }
    ]);
  });

  it("parses multiple args", () => {
    expect(parseFunctionArguments("func(1, 2)")).toEqual([
      {
        value: "1"
      },
      {
        value: "2"
      }
    ]);
  });

  it("parses trailing commas", () => {
    expect(parseFunctionArguments("func(1, 2,)")).toEqual([
      {
        value: "1"
      },
      {
        value: "2"
      }
    ]);
  });

  it("parses variable as the key and a number as the value", () => {
    expect(parseFunctionArguments("func($var: 1)")).toEqual([
      {
        key: "$var",
        value: "1"
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
        value: 'url("data:image/svg+xml;charset=utf8,%3C")'
      }
    ]);
  });

  it("parses variable as the key and interpolation as the value", () => {
    expect(parseFunctionArguments("reset($value: #{$other-value})")).toEqual([
      {
        key: "$value",
        value: "#{$other-value}"
      }
    ]);
  });

  it("parses variable as the key and a calculated value", () => {
    expect(parseFunctionArguments("anim($duration: 30 * 25ms)")).toEqual([
      {
        key: "$duration",
        value: "30 * 25ms"
      }
    ]);
  });

  it("parses 2 key value parameters", () => {
    expect(parseFunctionArguments("func($var: 1, $foo: bar)")).toEqual([
      {
        key: "$var",
        value: "1"
      },
      {
        key: `$foo`,
        value: "bar"
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
        value: "40px"
      },
      {
        key: "$second-value",
        value: "10px"
      },
      {
        key: "$color",
        value: "'black'"
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
        value: "to left"
      },
      {
        value: "#333"
      },
      {
        value: "#333 50%"
      },
      {
        value: "#eee 75%"
      },
      {
        value: "#333 75%"
      }
    ]);
  });
});
