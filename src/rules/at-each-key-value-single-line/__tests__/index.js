import { messages, ruleName } from "..";

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      $font-weights: ("regular": 400, "medium": 500, "bold": 700);
      @each $key, $value in $font-weights {}
      `,
      description: "Proper map loop that gets both keys + values"
    },
    {
      code: `
      $font-weights: ("regular": 400, "medium": 500, "bold": 700);
      @each $key in map-keys($font-weights) {}
      `,
      description: "Loop that just gets keys + has no need for values"
    },
    {
      code: `
       $font-weights: ("regular": 400, "medium": 500, "bold": 700);
       $other-weights: ("regular": 400, "medium": 500, "bold": 700);

       @each $key, $value in map-keys($font-weights) {
         $value: map-get($other-weights, $key);
       }
      `,
      description: "map-get pattern used with different hash than loop"
    }
  ],

  reject: [
    {
      code: `
      $font-weights: ("regular": 400, "medium": 500, "bold": 700);
      @each $key in map-keys($font-weights) {
        $value: map-get($font-weights, $key);
      }
      `,
      description: "Loop that gets keys + then grabs values inside the map",
      message: messages.expected,
      line: 3
    }
  ]
});
