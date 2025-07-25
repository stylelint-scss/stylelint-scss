# 6.12.1

- Fixed: `stylelint` deprecation warnings by adding `endIndex` to report objects in multiple rules (#1150).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.12.0...v6.12.1

# 6.12.0

- Added: `double-slash-comment-whitespace-inside` add autofix and fix incorrect error locations (#1146).
- Added: `declaration-property-value-no-unknown` add support for nested properties with shorthand values (#1142).
- Fixed: `operator-no-unspaced` don't check Tailwind Directives (#1147).
- Fixed: `at-use-no-redundant-alias` fix false negative for single quotes (#1130).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.11.1...v6.12.0

# 6.11.1

- Fixed: `no-duplicate-load-rules` fix false positive when using `@use` and `@forward` for the same stylesheet (#1124).
- Fixed: `declaration-property-value-no-unknown` add support for Sass' `rgba()` function with a hex value (#1123).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.11.0...v6.11.1

# 6.11.0

- Added: `no-duplicate-load-rules` rule (#1103).
- Fixed: `declaration-property-value-no-unknown` allow functions from explicit namespaces (#1113).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.10.1...v6.11.0

# 6.10.1

- Fixed: `declaration-property-value-no-unknown` fix trailing whitespace in value parsing (#1089).
- Fixed: `no-global-function-names` allow CSS round function (#1097).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.10.0...v6.10.1

# 6.10.0

- Added: `declaration-property-value-no-unknown` support nested properties with shorthand values (#1071).
- Fixed: `declaration-property-value-no-unknown` fix multiline values parsing (#1085).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.9.0...v6.10.0

# 6.9.0

- Added: missing native functions (#1070).
- Fixed: unify rule messages (#1072).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.8.1...v6.9.0

# 6.8.1

- Fixed: `declaration-property-value-no-unknown` fix false positives for nested properties in nested declarations (#1068).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.8.0...v6.8.1

# 6.8.0

- Added: `function-color-channel` rule (#1060).
- Added: `selector-no-redundant-nesting-selector` support for Dart Sass deprecation (#1022).
- Fixed: `declaration-property-value-no-unknown` include explicit namespace variables in `isDollarVar()` (#1062).
- Fixed: `declaration-property-value-no-unknown` fix false positives for imported custom functions (#1061).
- Fixed: `declaration-property-value-no-unknown` reported ranges and message ([stylelint/stylelint#8003](https://github.com/stylelint/stylelint/pull/8003), #1066).
- Fixed: `declaration-property-value-no-unknown` false negatives/positives via [`css-tree@3.0.0`](https://github.com/csstree/csstree/releases/tag/v3.0.0) ([stylelint/stylelint#7993](https://github.com/stylelint/stylelint/pull/7993), #1065).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.7.0...v6.8.0

# 6.7.0

- Added: `function-no-unknown`: add support for Sass v1.78 `color.channel` function (#1052).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.6.0...v6.7.0

# 6.6.0

- Added: `declaration-property-value-no-unknown`: add support for first-class operators (#1042).
- Added: `declaration-property-value-no-unknown`: add support SCSS variables as arguments in nested functions (#1042).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.5.1...v6.6.0

# 6.5.1

- Fixed: `function-quote-no-quoted-strings-inside` fix broken autofix (#1043).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.5.0...v6.5.1

# 6.5.0

- Added: `property-no-unknown` add support for nested declarations (#1024).
- Added: `declaration-property-value-no-unknown` rule (#1023).
- Fixed: `operator-no-unspaced` fix false positives with comparison operators (#1037).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.4.1...v6.5.0

# 6.4.1

- Fixed: false positive for mixins in `load-partial-extension` (#1021).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.4.0...v6.4.1

# 6.4.0

- Added: `load-partial-extension` rule, and deprecated `at-import-partial-extension` rule (#998).
- Fixed: `partial-no-import` message to include more accurate rule name (#1019).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.3.2...v6.4.0

# 6.3.2

- Fixed: `at-mixin-no-risky-nesting-selector` fix false positives (#1010).
- Fixed: `operator-no-unspaced` handle variables with unary negation (#1011).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.3.1...v6.3.2

# 6.3.1

- Fixed: `selector-no-redundant-nesting-selector` handle pseudo selectors (#1008).
- Fixed: `operator-no-unspaced` handle Tailwind CSS direct children styling (#1007).
- Fixed: `no-unused-private-members` fix changes from hyphen to underscore in debug message (#1002).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.3.0...v6.3.1

# 6.3.0

- Added: `at-mixin-no-risky-nesting-selector` rule (#985).
- Fixed: `property-no-unknown` ignore interpolated properties (#977).
- Fixed: `no-unused-private-members` treat hyphens and underscores as equals (#987).
- Fixed: `no-global-function-names` report errors inside at-rules (#988).
- Fixed: `operator-no-unspaced` ignore operators inside `@scope` (#995).
- Fixed: `no-duplicate-mixins` allow using the same mixin name in different scope (#997).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.2.1...v6.3.0

# 6.2.1

- Fixed: function-no-unknown: fix falsely reported CSS functions (#976).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.2.0...v6.2.1

# 6.2.0

- Added: `at-import-partial-extension-allowed-list` rule, and deprecated `at-import-partial-extension-whitelist` rule (#958).
- Added: `at-import-partial-extension-disallowed-list` rule, and deprecated `at-import-partial-extension-blacklist` rule (#958).
- Fixed: `no-unused-private-members` check variables used as parameters and skip files using `@import` (#957).
- Fixed: `no-unused-private-members` refactor variable search to match regex in atRules params and declaration values (#962).
- Fixed: `operator-no-unspaced` fix data uri in background shorthand (#968).
- Fixed: `at-rule-conditional-no-parentheses` remove extra autofix space (#969).
- Fixed: `function-no-unknown` handle functions inside interpolation (#970).
- Fixed: `operator-no-unspaced` fix function calls inside interpolation (#972).
- Fixed: `at-function-named-arguments` handle interpolation in ignored function names (#973).
- Fixed: `at-import-no-partial-leading-underscore` fix version in deprecation message (#974).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.1.0...v6.2.0

# 6.1.0

- Added: `no-unused-private-members` rule (#884).
- Added: support end positions for warnings (#899, #900, #901, #902, #903, #904, #905, #906, #907, #908, #909, #910, #911, #912, #913, #914, #915, #916, #917, #918, #919, #920, #921, #922, #923, #925, #926, #927, #928, #929, #930, #932, #933, #934, #935, #936, #937, #938, #939, #940).
- Fixed: `function-calculation-no-interpolation` allow calc function interpolation in SassScript (#947)
- Fixed: `property-no-unknown` support deeper nested properties (#948)

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v6.0.0...v6.1.0

# 6.0.0

- Added: `stylelint@16` support.
- Removed: `stylelint@14` and `stylelint@15` support.

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v5.3.2...v6.0.0

# 5.3.2

- Fixed: `function-no-unknown` false negatives for functions with namespace (#888)
- Fixed: `at-root-no-redundant` check selector list for parent selectors (#886)

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v5.3.1...v5.3.2

# 5.3.1

- Fixed: improve `block-no-redundant-nesting` autofix (#883).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v5.3.0...v5.3.1

# 5.3.0

- Added: `block-no-redundant-nesting` rule (#872).
- Added: `load-no-partial-leading-underscore` rule, and deprecated `at-import-no-partial-leading-underscore` rule (#867).
- Added: autofix to `at-root-no-redundant` rule (#860).
- Added: autofix to `at-use-no-redundant-alias` rule (#866).
- Fixed: `at-root-no-redundant` check if all selectors followed by `@at-root` include '&' outside interpolation (#870).
- Fixed: add `styleLintType: "parseError"` when `parseSelector` fails (#858).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v5.2.1...v5.3.0

# 5.2.1

- Fixed: add missing `known-css-properties` dependency (#857).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v5.2.0...v5.2.1

# 5.2.0

- Added: `at-root-no-redundant` rule to ban unnecessary `@at-root` rule (#846).
- Added: `property-no-unknown` rule to disallow unknown properties. (#847).
- Added: `at-use-no-redundant-alias` rule to disallow redundant namespace aliases (#848).
- Added: `function-calculation-no-interpolation` rule to forbid interpolation in calc functions (#849).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v5.1.0...v5.2.0

# 5.1.0

- Added: `function-disallowed-list` rule support to ban specific built-in functions (#422, #844).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v5.0.1...v5.1.0

# 5.0.1

- Fixed: `function-no-unknown` ignore empty function names (#826).

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v5.0.0...v5.0.1

# 5.0.0

- Removed: `Babel` dependency to remove an extra build step and reduce complexity

# 4.7.0

- Fixed: docs - small formatting fixes
- Removed: `dlv` dependency

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v4.6.0...v4.7.0

# 4.6.0

- Fixed: docs - fix broken links and wording tweaks
- Removed: Lodash dependency

**Full Changelog**: https://github.com/stylelint-scss/stylelint-scss/compare/v4.5.0...v4.6.0

# 4.5.0

- Fixed: `operator-no-unspaced` make data uri regex less strict (#767).
- Changed: `operator-no-unspaced` add support for `:has` (#768).
- Changed: `function-no-unknown` add support for `@use` (#773).

# 4.4.0

- Added: support for stylelint version 15.
- Added: `at-rule-no-unknown` and `at-each-key-value-single-line` rules support for end positions (#655, #689).
- Fixed: `at-function-pattern` and `at-mixin-pattern`, fix warnings to range only one line (#639).
- Fixed: `at-import-partial-extension` autofix incorrectly replacing the filename (#643).
- Fixed: `media-feature-value-dollar-variable` add support for `@use` (#715).
- Fixed: `function-quote-no-quoted-strings-inside` bug with autofix (#740).

# 4.3.0

- Added: options ignore: "after-dollar-variable" to `dollar-variable-empty-line-before` (#604)
- Fixed: Make filenames with dots work with `at-import-partial-extension` rule (#612)
- Added: `meta` property for all rules (#602)
- Added: `at-import-partial-extension` autofix only when `"never"` (#608)

# 4.2.0

- Added: `function-no-unknown` rule (#591).
- Updated: `stylelint` peer dependency version to `^14.5.1` (required by the `function-no-unknown` rule).

# 4.1.0

- Added: `at-use-no-unnamespaced` rule (#569).
- Added: `dollar-variable-no-namespaced-assignment` rule (#570).
- Changed: `at-each-key-value-single-line` add support for Sass modules (#580).

# 4.0.1

- Fixed: `operator-no-unspaced` false positive when using a loop (#575).
- Fixed: `operator-no-unspaced` don't check operators from data URIs (#574).
- Updated: `parseSelector` function to match the one in stylelint repo (#567).
- Fixed: `no-global-function-names` removed checks functions that cause warnings for global CSS functions (min, max, filter) (#566).

# 4.0.0

- Removed: `stylelint@13` support.
- Added: `stylelint@14` support.

# 3.21.0

- Changed: `no-global-function-names` handle interpolated values and add mappings for color functions.

# 3.20.1

- Fixed: `comment-no-empty` remove duplicate rule name from rule's rejected message and improve readme.
- Fixed: `at-rule-no-unknown` remove duplicate rule name from rule's rejected message.

# 3.20.0

- Changed: `dollar-variable-first-in-block` to support `@use` and `@forward` when using the `ignore: ["imports"]` option.
- Fixed: `selector-nest-combinators` throwing an error when certain type of nesting was used.
- Fixed: `dimension-no-non-numeric-values` throwing an error for certain type of unitless interpolation.

# 3.19.0

- Added: `ignoreDefaults` option to `no-duplicate-dollar-variables` rule.

# 3.18.0

- Added: `selector-no-redundant-nesting-selector` add `ignoreKeywords` option to ignore certain keywords that can be used in [Less](http://lesscss.org) or some other non-Scss syntax.
- Fixed: `comment-no-loud` fix a bug where the rule was only checking for comments that were in the beginning of the file.

# 3.17.2

- Updated: `postcss-value-parser` dependency and dev dependencies to latest versions.

# 3.17.1

- Fixed: `function-color-relative` false positives for CSS `filter` property.

# 3.17.0

- Added: `comment-no-empty` rule.

# 3.16.1

- Fixed: `operator-no-unspaced` don't warn for negative numbers inside a function call in interpolated values.

# 3.16.0

- Added: `no-global-function-names` rule.
- Added: `dollar-variable-first-in-block` rule.
- Added: `dollar-variable-empty-line-after` rule.
- Fixed: `function-color-relative`, `function-quote-no-quoted-strings-inside` and `function-unquote-no-unquoted-strings-inside` point the warning to the function name.

# 3.15.0

- Changed: `no-duplicate-dollar-variables` do not warn for duplicate variables that are in different scopes. A dollar variable is now considered a duplicate if it shadows a variable of the same name (see the [Sass documentation](https://sass-lang.com/documentation/variables#shadowing)).
- Added: `media-feature-value-dollar-variable` new option `ignore: ["keywords"]` to not warn when the media feature value is a keyword value like `none`, `dark`, `fine`, `srgb`.
- Added: `double-slash-comment-empty-line-before` new options `except: ["inside-block"]` and `ignore: ["inside-block"]`.
- Fixed: `operator-no-unspaced` do not find operators in valid unquoted URLs.

# 3.14.2

- Fixed: `operator-no-unspaced` ignore operators inside `@at-root`.

# 3.14.1

- Fixed: `at-import-partial-extension` don't warn for urls that have commas in them.

# 3.14.0

- Added: support for stylelint version 13.
- Fixed: avoid possible breaking changes in the future by not using stylelint's internal utility functions.

# 3.13.0

- Added: support for stylelint version 12.
- Fixed: duplicate warnings in `at-rule-no-unknown` rule.

# 3.12.1

- Fixed: `at-rule-conditional-no-parentheses` don't warn for function calls.
- Fixed: `map-keys-quotes` ignore math operators inside map values.
- Fixed: `operator-no-unspaced` was looking for operators inside `@forward` and `@use`.

# 3.12.0

- Added: `no-duplicate-mixins` rule.
- Added: `at-rule-no-unknown` support for Sass' `@forward` and `@use`.

# 3.11.1

- Fixed: `selector-nest-combinators` warning for `@keyframes`.

# 3.11.0

- Added: support for stylelint version 11.

# 3.10.1

- Fixed: broken linting reporting for `dimension-no-non-numeric-values` rule.

# 3.10.0

- Added: `at-if-no-null`rule.
- Added: `at-import-partial-extension` rule.
- Added: `at-rule-conditional-no-parentheses` rule.
- Added: `dimension-no-non-numeric-values` rule.

# 3.9.4

- Fixed: `selector-nest-combinators` rule throwing an error when using nested props.

# 3.9.3

- Fixed: `map-keys-quotes` warning for unquoted numeric keys.

# 3.9.2

- Fixed: `selector-no-union-class-name` throwing an error when using nested `@`-rules.

# 3.9.1

- Fixed: `selector-no-union-class-name` false positives for id, attribute, and pseudo selectors.

# 3.9.0

- Added: `selector-no-union-class-name` rule.
- Added: `function-color-relative` rule.
- Added: `comment-no-loud` rule.
- Added: `map-keys-quotes` rule.
- Fixed: typo in error message for `at-else-empty-line-before` and `dollar-variable-empty-line-before` rules.

# 3.8.0

- Added: `function-unquote-no-unquoted-strings-inside` rule.
- Fixed: wrong message name for `at-each-key-value-single-line` rule.

# 3.7.0

- Added: `at-each-key-value-single-line` rule.
- Added: `function-quote-no-quoted-strings-inside` rule.

# 3.6.1

- Fixed: `double-slash-comment-empty-line-before` autofix not working in certain situations.

# 3.6.0

- Added: support for stylelint version 10.

# 3.5.4

- Fixed: `dollar-variable-colon-newline-after` no longer warns for multiline variables that use `!default`.

# 3.5.3

- Fixed: `operator-no-unspaced` no longer warns for valid absolute urls and urls with interpolation.

# 3.5.2

- Fixed: handle SCSS interpolation in `selector-nest-combinators` rule.

# 3.5.1

- Fixed: error messages for `selector-nest-combinators` rule.

# 3.5.0

- Added: `selector-nest-combinators` rule.

# 3.4.4

- Updated: `postcss-selector-parser` dependency to 5.0.0 (major version bump) with a memory leak fix and other bug fixes.

# 3.4.3

- Fixed: `double-slash-comment-whitespace-inside` fix error being thrown when using two backslashes inside a string.

# 3.4.2

- Fixed: `operator-no-unspaced` no longer warns for relative url paths.

# 3.4.1

- Fixed: `at-function-named-arguments` was not correctly handling functions inside Sass maps.

# 3.4.0

- Added: `at-mixin-argumentless-call-parentheses` autofix (#280).
- Fixed: `partial-no-import` correctly handle import parameters with urls (#283).

# 3.3.2

- Fixed: Account for hyphens in function names (`at-function-parentheses-space-before`) and mixin (`at-mixin-parentheses-space-before`) names.

# 3.3.1

- Fixed: `at-function-named-arguments` correctly parse function arguments with trailing commas.

# 3.3.0

- Added: `at-function-named-arguments` add `ignoreFunctions` option.
- Fixed: `at-function-named-arguments` correctly parse data uris as function parameters.

# 3.2.0

- Added: `no-dollar-variables` rule.
- Added: `ignoreInside` and `ignoreInsideAtRules` options to `no-duplicate-dollar-variables` rule.
- Fixed: `operator-no-unspaced` no longer warns for `unicode-range` property.

# 3.1.3

- Fixed: compatibility with non css syntaxes for `operator-no-newline-after` and `operator-no-newline-before` rules.

# 3.1.2

- Fixed: compatibility with non css syntaxes.

# 3.1.1

- Fixed: `operator-no-newline-before` and `operator-no-unspaced` rules were throwing an error when using CSS custom properties.

# 3.1.0

- Added: `no-duplicate-dollar-variables` rule.

# 3.0.1

- Fixed: `at-function-named-arguments` now ignores Sass maps.

# 3.0.0

- Removed: Node.JS 4.x support. Node.js 6.x or greater is now required (#213).
- Added: `at-else-empty-line-before` autofix (#221).
- Added: `at-else-if-parentheses-space-before` autofix (#222).
- Added: `at-function-parentheses-space-before` autofix (#223).
- Added: `at-mixin-parentheses-space-before` autofix (#224).
- Added: `dollar-variable-empty-line-before` autofix (#226).
- Added: `dollar-variable-colon-space-after` autofix (#227).
- Added: `dollar-variable-colon-space-before` autofix (#227).
- Added: `at-else-closing-brace-space-after` autofix (#228).
- Added: `at-if-else-closing-brace-space-after` autofix (#228).
- Added: `at-else-closing-brace-newline-after` autofix (#229).
- Added: `at-if-closing-brace-newline-after` autofix (#229).
- Added: `double-slash-comment-empty-line-before` autofix (#230).
- Added: `dollar-variable-colon-newline-after` autofix (#231).

# 2.5.0

- Added: `at-least-one-space` option to `dollar-variable-colon-space-after` rule.
- Fixed: `dollar-variable-colon-newline-after` now does not require a newline for Sass maps and multiline variables with parentheses when `always-multi-line` option is used.

# 2.4.0

- Added: support for stylelint version 9.
- Fixed: `dollar-variable-colon-newline-after` now allows multiline variables when `always` option is used.

# 2.3.0

- Added: `dollar-variable-default` rule.

# 2.2.0

- Added: `at-function-named-arguments` rule.
- Added: `at-mixin-named-arguments` rule.

# 2.1.0

- Added: `at-else-if-parentheses-space-before` rule.
- Added: `at-function-parentheses-space-before` rule.
- Added: `at-mixin-parentheses-space-before` rule.

# 2.0.1

- Fixed: `selector-no-redundant-nesting-selector` now handles multiple nested selectors.

# 2.0.0

This version updates stylelint to version 8 and removes 2 rules that were deprecated in earlier versions.

- Breaking changes:
  - Updated: stylelint dependency from version 7 to version 8.
  - Changed: stylelint is now listed in `peerDependencies` instead of `dependencies`. This means that you need to have `stylelint` installed in your project before using `stylelint-scss`.
  - Changed: white/blacklists and ignore\* options to be case sensitive by default. See https://github.com/stylelint/stylelint/pull/2709
  - Removed: 2 deprecated rules
    - `at-import-no-partial-extension`
    - `at-mixin-no-argumentless-call-parentheses`

# 1.5.2

- Fixed: `operator-no-unspaced` support escaped operators by handling them in `sassValueParser`.
- Fixed: `declaration-nested-properties` support escaped selectors by checking for escaped characters in `parseNestedPropRoot`.

# 1.5.1

- Fixed: `at-rule-no-unknown` add missing export to `ruleName`.
- Fixed: `at-rule-no-unknown` add options validation.

# 1.5.0

- Added: `at-rule-no-unknown` rule.

# 1.4.4

- Fixed: `at-if-closing-brace-newline-after`: support `@elseif`.

# 1.4.3

- Fixed: `at-mixin-no-argumentless-call-parentheses` messages

# 1.4.2:

- Fixed: false positives in inline comment detecting by `findCommentsInRaws` if a comment is the first/last in a file/line
- Fixed: `findCommentsInRaws` error in function detection

# 1.4.1

- Fixed: mixed import names for `at-else-closing-brace-space-after` and `at-else-empty-line-before` rules.
- Fixed: false positives for nested props rules (`:not()`-like selectors, strings, numbers).

# 1.4.0

- Added: `at-else-closing-brace-newline-after` rule.
- Added: `at-else-closing-brace-space-after` rule.
- Added: `at-if-closing-brace-newline-after` rule.
- Added: `at-if-closing-brace-space-after` rule.
- Added: `at-else-empty-line-before` rule.
- Added: `declaration-nested-properties` rule.
- Added: `declaration-nested-properties-no-divided-groups` rule.
- Added: `dollar-variable-empty-line-before` rule.
- Added: `ignore: "local"|"global"` to the `dollar-variable-pattern` rule.
- Added: `docs` folder to `npm` package.
- Removed: `src` folder from `npm` package.
- Removed: NodeJS 0.12.x support, stylelint-scss now requires NodeJS > 4.2.1 LTS or greater

# 1.3.4

- Fixed: parsing `-` and `+` at the operation start in `operator-` rules.
- Fixed: `findCommentsInRaws` false positives on comments inside strings (applicable to rules `double-slash-comment-inline`, `double-slash-comment-whitespace-inside`, `operator-no-unspaced`).

# 1.3.3

- Fixed: parsing `%` character by `operator-` rules.
- Fixed: false positives on `operator-` rules.

# 1.3.2

- Fixed: `findCommentsInRaws` fail on parsing selectors like `p:not(.not-p)` (applicable to rules `double-slash-comment-inline`, `double-slash-comment-whitespace-inside`, `operator-no-unspaced`).
- Fixed: 'double-slash-comment-whitespace-inside' false positives on empty comments (e.g. `//`).
- Fixed: `findCommentsInRaws` giving wrong column number (applicable to rules `double-slash-comment-inline`, `double-slash-comment-whitespace-inside`, `operator-no-unspaced`).

# 1.3.1

- Fixed: `findCommentsInRaws` for multiline CSS comments and text for //-comments (`double-slash-comment-` rules and `operator-no-unspaced` rule).

# 1.3.0

- Added: `at-mixin-argumentless-call-parentheses` rule (with "always"/"never" behavior as a replacement for `at-mixin-no-argumentless-call-parentheses`).
- Added: `dollar-variable-colon-newline-after` rule.
- Added: `dollar-variable-colon-space-after` rule.
- Added: `dollar-variable-colon-space-before` rule.
- Added: `double-slash-comment-empty-line-before` rule.
- Added: `double-slash-comment-inline` rule.
- Added: `double-slash-comment-whitespace-inside` rule.
- Added: `operator-no-newline-after` rule.
- Added: `operator-no-newline-before` rule.
- Added: `operator-no-unspaced` rule.
- Deprecated: `at-mixin-no-argumentless-call-parentheses`.
- Fixed: `partial-no-import` failing when linting a code string (not in an actual file, e.g. via stylelilnt Node API).
- Updated stylelint dependency to version 7.

# 1.2.1

- Fixed: `at-function-pattern`, `at-mixin-pattern` failing if there are parens inside a parameters list.

# 1.2.0

- Added: `partial-no-import` rule.
- Added: `media-feature-value-dollar-variable` rule.
- Added: `at-import-partial-extension-blacklist` rule.
- Added: `at-import-partial-extension-whitelist` rule.
- Deprecated: `at-import-no-partial-extension` rule.
- Fixed: `dollar-variable-no-missing-interpolation` was throwing an error on older Node.js versions.

# 1.1.1

- Fixed: newlines inside braces in `at-function-pattern`, `at-mixin-pattern`.
- Fixed: false positives and false negatives in `selector-no-redundant-nesting-selector`.

# 1.1.0

- Added: `at-mixin-no-argumentless-call-parentheses` rule.
- Added: `at-import-no-partial-leading-underscore` rule.
- Added: `at-import-no-partial-extension` rule.
- Added: `percent-placeholder-pattern` rule.
- Fixed: `selector-no-redundant-nesting-selector` no longer warns about BEM syntax.
- Fixed: bug causing rules to ignore severity levels `warning` / `error` and report `ignore` instead.

# 1.0.0

- Added: `at-extend-no-missing-placeholder` rule.
- Added: `at-function-pattern` rule.
- Added: `at-mixin-pattern` rule.
- Added: `dollar-variable-no-missing-interpolation` rule.
- Added: `dollar-variable-pattern` rule.
- Added: `selector-no-redundant-nesting-selector` rule.
