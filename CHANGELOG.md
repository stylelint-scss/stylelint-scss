# HEAD

- Added: `at-mixin-argumentless-call-parentheses` rule (with "always"/"never" behavior). Deprecated `at-mixin-no-argumentless-call-parentheses`.
- Added: `operator-no-unspaced` rule.

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
