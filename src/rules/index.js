"use strict";

const importLazy = require("import-lazy");

const rules = {
  "at-each-key-value-single-line": importLazy(() =>
    require("./at-each-key-value-single-line")
  )(),
  "at-else-closing-brace-newline-after": importLazy(() =>
    require("./at-else-closing-brace-newline-after")
  )(),
  "at-else-closing-brace-space-after": importLazy(() =>
    require("./at-else-closing-brace-space-after")
  )(),
  "at-else-empty-line-before": importLazy(() =>
    require("./at-else-empty-line-before")
  )(),
  "at-else-if-parentheses-space-before": importLazy(() =>
    require("./at-else-if-parentheses-space-before")
  )(),
  "at-extend-no-missing-placeholder": importLazy(() =>
    require("./at-extend-no-missing-placeholder")
  )(),
  "at-function-named-arguments": importLazy(() =>
    require("./at-function-named-arguments")
  )(),
  "at-function-parentheses-space-before": importLazy(() =>
    require("./at-function-parentheses-space-before")
  )(),
  "at-function-pattern": importLazy(() => require("./at-function-pattern"))(),
  "at-if-closing-brace-newline-after": importLazy(() =>
    require("./at-if-closing-brace-newline-after")
  )(),
  "at-if-closing-brace-space-after": importLazy(() =>
    require("./at-if-closing-brace-space-after")
  )(),
  "at-if-no-null": importLazy(() => require("./at-if-no-null"))(),
  "at-import-no-partial-leading-underscore": importLazy(() =>
    require("./at-import-no-partial-leading-underscore")
  )(),
  "at-import-partial-extension-blacklist": importLazy(() =>
    require("./at-import-partial-extension-blacklist")
  )(),
  "at-import-partial-extension-whitelist": importLazy(() =>
    require("./at-import-partial-extension-whitelist")
  )(),
  "at-import-partial-extension": importLazy(() =>
    require("./at-import-partial-extension")
  )(),
  "at-mixin-argumentless-call-parentheses": importLazy(() =>
    require("./at-mixin-argumentless-call-parentheses")
  )(),
  "at-mixin-named-arguments": importLazy(() =>
    require("./at-mixin-named-arguments")
  )(),
  "at-mixin-parentheses-space-before": importLazy(() =>
    require("./at-mixin-parentheses-space-before")
  )(),
  "at-mixin-pattern": importLazy(() => require("./at-mixin-pattern"))(),
  "at-rule-conditional-no-parentheses": importLazy(() =>
    require("./at-rule-conditional-no-parentheses")
  )(),
  "at-rule-no-unknown": importLazy(() => require("./at-rule-no-unknown"))(),
  "at-use-no-unnamespaced": importLazy(() =>
    require("./at-use-no-unnamespaced")
  )(),
  "comment-no-empty": importLazy(() => require("./comment-no-empty"))(),
  "comment-no-loud": importLazy(() => require("./comment-no-loud"))(),
  "declaration-nested-properties-no-divided-groups": importLazy(() =>
    require("./declaration-nested-properties-no-divided-groups")
  )(),
  "declaration-nested-properties": importLazy(() =>
    require("./declaration-nested-properties")
  )(),
  "dimension-no-non-numeric-values": importLazy(() =>
    require("./dimension-no-non-numeric-values")
  )(),
  "dollar-variable-colon-newline-after": importLazy(() =>
    require("./dollar-variable-colon-newline-after")
  )(),
  "dollar-variable-colon-space-after": importLazy(() =>
    require("./dollar-variable-colon-space-after")
  )(),
  "dollar-variable-colon-space-before": importLazy(() =>
    require("./dollar-variable-colon-space-before")
  )(),
  "dollar-variable-default": importLazy(() =>
    require("./dollar-variable-default")
  )(),
  "dollar-variable-empty-line-after": importLazy(() =>
    require("./dollar-variable-empty-line-after")
  )(),
  "dollar-variable-empty-line-before": importLazy(() =>
    require("./dollar-variable-empty-line-before")
  )(),
  "dollar-variable-first-in-block": importLazy(() =>
    require("./dollar-variable-first-in-block")
  )(),
  "dollar-variable-no-missing-interpolation": importLazy(() =>
    require("./dollar-variable-no-missing-interpolation")
  )(),
  "dollar-variable-no-namespaced-assignment": importLazy(() =>
    require("./dollar-variable-no-namespaced-assignment")
  )(),
  "dollar-variable-pattern": importLazy(() =>
    require("./dollar-variable-pattern")
  )(),
  "double-slash-comment-empty-line-before": importLazy(() =>
    require("./double-slash-comment-empty-line-before")
  )(),
  "double-slash-comment-inline": importLazy(() =>
    require("./double-slash-comment-inline")
  )(),
  "double-slash-comment-whitespace-inside": importLazy(() =>
    require("./double-slash-comment-whitespace-inside")
  )(),
  "function-color-relative": importLazy(() =>
    require("./function-color-relative")
  )(),
  "function-no-unknown": importLazy(() => require("./function-no-unknown"))(),
  "function-quote-no-quoted-strings-inside": importLazy(() =>
    require("./function-quote-no-quoted-strings-inside")
  )(),
  "function-unquote-no-unquoted-strings-inside": importLazy(() =>
    require("./function-unquote-no-unquoted-strings-inside")
  )(),
  "map-keys-quotes": importLazy(() => require("./map-keys-quotes"))(),
  "media-feature-value-dollar-variable": importLazy(() =>
    require("./media-feature-value-dollar-variable")
  )(),
  "no-dollar-variables": importLazy(() => require("./no-dollar-variables"))(),
  "no-duplicate-dollar-variables": importLazy(() =>
    require("./no-duplicate-dollar-variables")
  )(),
  "no-duplicate-mixins": importLazy(() => require("./no-duplicate-mixins"))(),
  "no-global-function-names": importLazy(() =>
    require("./no-global-function-names")
  )(),
  "operator-no-newline-after": importLazy(() =>
    require("./operator-no-newline-after")
  )(),
  "operator-no-newline-before": importLazy(() =>
    require("./operator-no-newline-before")
  )(),
  "operator-no-unspaced": importLazy(() => require("./operator-no-unspaced"))(),
  "partial-no-import": importLazy(() => require("./partial-no-import"))(),
  "percent-placeholder-pattern": importLazy(() =>
    require("./percent-placeholder-pattern")
  )(),
  "selector-nest-combinators": importLazy(() =>
    require("./selector-nest-combinators")
  )(),
  "selector-no-redundant-nesting-selector": importLazy(() =>
    require("./selector-no-redundant-nesting-selector")
  )(),
  "selector-no-union-class-name": importLazy(() =>
    require("./selector-no-union-class-name")
  )()
};

module.exports = rules;
