import { parseNestedPropRoot } from "../";
import test from "tape";

// --------------------------------------------------------------------------
// nested props
// --------------------------------------------------------------------------

test("`background:`", t => {
  t.plan(1);

  const result = parseNestedPropRoot("background:");

  t.deepEqual(result, {
    propName: {
      value: "background",
      after: ""
    }
  });
});

test("`background: red`", t => {
  t.plan(1);

  const result = parseNestedPropRoot("background: red");

  t.deepEqual(result, {
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

test("`margin:10px`", t => {
  t.plan(1);

  const result = parseNestedPropRoot("margin:10px");

  t.deepEqual(result, {
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

test("`margin:$var`", t => {
  t.plan(1);

  const result = parseNestedPropRoot("margin:$var");

  t.deepEqual(result, {
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

test("`input: -moz-focusring ` -- yes, this IS parsed as 'prop: value' by Sass!", t => {
  t.plan(1);

  const result = parseNestedPropRoot("input: -moz-focusring");

  t.deepEqual(result, {
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

test("`background  :  red`", t => {
  t.plan(1);

  const result = parseNestedPropRoot("background  :  red");

  t.deepEqual(result, {
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

test("Edge case: function with param `#{fn($a:1)}:`.", t => {
  t.plan(1);

  const result = parseNestedPropRoot("#{fn($a:1)}:");

  t.deepEqual(result, {
    propName: {
      value: "#{fn($a:1)}",
      after: ""
    }
  });
});

test("Edge case: function with param `#{fn($a: 1)}:`.", t => {
  t.plan(1);

  const result = parseNestedPropRoot("#{fn($a: 1)}:");

  t.deepEqual(result, {
    propName: {
      value: "#{fn($a: 1)}",
      after: ""
    }
  });
});

test('`input:"prop: value"` (value is a string).', t => {
  t.plan(1);

  const result = parseNestedPropRoot('input:"prop: value"');

  t.deepEqual(result, {
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

// --------------------------------------------------------------------------
// selectors
// --------------------------------------------------------------------------

test("`background:red` (compiles to a selector by Sass)", t => {
  t.plan(1);

  const result = parseNestedPropRoot("background:red");

  t.equal(result, null);
});

test("`background :red` (compiles to a selector by Sass)", t => {
  t.plan(1);

  const result = parseNestedPropRoot("background :red");

  t.equal(result, null);
});

test("`&:a1px` (trying to invoke false positive for a number as a value)", t => {
  t.plan(1);

  const result = parseNestedPropRoot("&:a1px");

  t.equal(result, null);
});

test("`input:-moz-focusring `", t => {
  t.plan(1);

  const result = parseNestedPropRoot("input:-moz-focusring");

  t.deepEqual(result, null);
});

test("`&:not(.other-class) `", t => {
  t.plan(1);

  const result = parseNestedPropRoot("&:not(.other-class)");

  t.deepEqual(result, null);
});

test("`&:pseudo`", t => {
  t.plan(1);

  const result = parseNestedPropRoot("&:pseudo");

  t.deepEqual(result, null);
});

// --------------------------------------------------------------------------
// other something
// --------------------------------------------------------------------------

test('`"input: prop"` (a "-string)', t => {
  t.plan(1);

  const result = parseNestedPropRoot('"input: prop"');

  t.deepEqual(result, null);
});

test("`'input: prop'` (a '-string)", t => {
  t.plan(1);

  const result = parseNestedPropRoot("'input: prop'");

  t.deepEqual(result, null);
});
