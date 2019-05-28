# at-rule-each-key-value-single-line

 Disallow situations where users loop over map-keys and fetch the value inside the loop.

 ```scss
 $font-weights: ("regular": 400, "medium": 500, "bold": 700);
 @each $key in map-keys($font-weights) {
   $value: map-get($font-weights, $key);
/**        ↑
 * This call should be consolidated into the @each call.
 }
  }
 ```

 ## Options

 ### `true`

 The following patterns are considered violations:

 ```scss
 $font-weights: ("regular": 400, "medium": 500, "bold": 700);
 @each $key in map-keys($font-weights) {
   $value: map-get($font-weights, $key);
 }
```

 The following patterns are *not* considered violations:

 ```scss
 $font-weights: ("regular": 400, "medium": 500, "bold": 700);
 @each $key, $value in $font-weights {...}
```

 ```scss
 $font-weights: ("regular": 400, "medium": 500, "bold": 700);
 $other-weights: ("regular": 400, "medium": 500, "bold": 700);

 @each $key, $value in map-keys($font-weights) {
   $value: map-get($other-weights, $key);
 }
```

 ```scss
 $font-weights: ("regular": 400, "medium": 500, "bold": 700);

 @each $key, $value in map-keys($font-weights) {...}
```
