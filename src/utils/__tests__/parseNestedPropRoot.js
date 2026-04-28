import parseNestedPropRoot from "../parseNestedPropRoot.js";

// --------------------------------------------------------------------------
// nested property roots
// --------------------------------------------------------------------------

test("`background:`", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("background:");

  expect(result).toEqual({
    propName: {
      value: "background",
      after: ""
    }
  });
});

test("`background: red`", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("background: red");

  expect(result).toEqual({
    propName: {
      value: "background",
      after: ""
    },
    propValue: {
      value: "red",
      before: " ",
      sourceIndex: 12
    }
  });
});

test("`margin:10px`", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("margin:10px");

  expect(result).toEqual({
    propName: {
      value: "margin",
      after: ""
    },
    propValue: {
      value: "10px",
      before: "",
      sourceIndex: 7
    }
  });
});

test("`margin:$var`", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("margin:$var");

  expect(result).toEqual({
    propName: {
      value: "margin",
      after: ""
    },
    propValue: {
      value: "$var",
      before: "",
      sourceIndex: 7
    }
  });
});

test("`input: -moz-focusring ` -- yes, this IS parsed as 'prop: value' by Sass!", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("input: -moz-focusring");

  expect(result).toEqual({
    propName: {
      value: "input",
      after: ""
    },
    propValue: {
      value: "-moz-focusring",
      before: " ",
      sourceIndex: 7
    }
  });
});

test("`background  :  red`", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("background  :  red");

  expect(result).toEqual({
    propName: {
      value: "background",
      after: "  "
    },
    propValue: {
      value: "red",
      before: "  ",
      sourceIndex: 15
    }
  });
});

test("Edge case: function with param `#{fn($a:1)}:`.", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("#{fn($a:1)}:");

  expect(result).toEqual({
    propName: {
      value: "#{fn($a:1)}",
      after: ""
    }
  });
});

test("Edge case: function with param `#{fn($a: 1)}:`.", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("#{fn($a: 1)}:");

  expect(result).toEqual({
    propName: {
      value: "#{fn($a: 1)}",
      after: ""
    }
  });
});

test('`input:"prop: value"` (value is a double-quoted string).', () => {
  expect.assertions(1);

  const result = parseNestedPropRoot('input:"prop: value"');

  expect(result).toEqual({
    propName: {
      value: "input",
      after: ""
    },
    propValue: {
      value: '"prop: value"',
      before: "",
      sourceIndex: 6
    }
  });
});

test("``input:'prop: value'`` (value is a single-quoted string).", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("input:'prop: value'");

  expect(result).toEqual({
    propName: {
      value: "input",
      after: ""
    },
    propValue: {
      value: "'prop: value'",
      before: "",
      sourceIndex: 6
    }
  });
});

test('`input: "it\'s a value"` (double-quoted string containing a single quote).', () => {
  expect.assertions(1);

  const result = parseNestedPropRoot('input: "it\'s a value"');

  expect(result).toEqual({
    propName: {
      value: "input",
      after: ""
    },
    propValue: {
      value: '"it\'s a value"',
      before: " ",
      sourceIndex: 7
    }
  });
});

test("``input: 'prop: \"value\"'`` (single-quoted string containing a double quote).", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("input: 'prop: \"value\"'");

  expect(result).toEqual({
    propName: {
      value: "input",
      after: ""
    },
    propValue: {
      value: "'prop: \"value\"'",
      before: " ",
      sourceIndex: 7
    }
  });
});

test('`#{fn("prop: \\"value\\"")}:` (interpolation containing a string with an escaped double quote).', () => {
  expect.assertions(1);

  const result = parseNestedPropRoot('#{fn("prop: \\"value\\"")}:');

  expect(result).toEqual({
    propName: {
      value: '#{fn("prop: \\"value\\"")}',
      after: ""
    }
  });
});

test("``#{fn('prop: \\'value\\'')}:`` (interpolation containing a string with an escaped single quote).", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("#{fn('prop: \\'value\\'')}:");

  expect(result).toEqual({
    propName: {
      value: "#{fn('prop: \\'value\\'')}",
      after: ""
    }
  });
});

// --------------------------------------------------------------------------
// selectors
// --------------------------------------------------------------------------

test("`background:red` (compiles to a selector by Sass)", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("background:red");

  expect(result).toBeNull();
});

test("`background :red` (compiles to a selector by Sass)", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("background :red");

  expect(result).toBeNull();
});

test("`&:a1px` (trying to invoke false positive for a number as a value)", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("&:a1px");

  expect(result).toBeNull();
});

test("`input:-moz-focusring `", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("input:-moz-focusring");

  expect(result).toBeNull();
});

test("`&:not(.other-class) `", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("&:not(.other-class)");

  expect(result).toBeNull();
});

test("`&:pseudo`", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("&:pseudo");

  expect(result).toBeNull();
});

// --------------------------------------------------------------------------
// quoted strings
// --------------------------------------------------------------------------

test('`"input: prop"` (a "-string)', () => {
  expect.assertions(1);

  const result = parseNestedPropRoot('"input: prop"');

  expect(result).toBeNull();
});

test("`'input: prop'` (a '-string)", () => {
  expect.assertions(1);

  const result = parseNestedPropRoot("'input: prop'");

  expect(result).toBeNull();
});
