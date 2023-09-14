"use strict";

const rules = {
  "at-each-key-value-single-line": require("./at-each-key-value-single-line"),
  "at-else-closing-brace-newline-after": require("./at-else-closing-brace-newline-after"),
  "at-else-closing-brace-space-after": require("./at-else-closing-brace-space-after"),
  "at-else-empty-line-before": require("./at-else-empty-line-before"),
  "at-else-if-parentheses-space-before": require("./at-else-if-parentheses-space-before"),
  "at-extend-no-missing-placeholder": require("./at-extend-no-missing-placeholder"),
  "at-function-named-arguments": require("./at-function-named-arguments"),
  "at-function-parentheses-space-before": require("./at-function-parentheses-space-before"),
  "at-function-pattern": require("./at-function-pattern"),
  "at-if-closing-brace-newline-after": require("./at-if-closing-brace-newline-after"),
  "at-if-closing-brace-space-after": require("./at-if-closing-brace-space-after"),
  "at-if-no-null": require("./at-if-no-null"),
  "at-import-no-partial-leading-underscore": require("./at-import-no-partial-leading-underscore"),
  "at-import-partial-extension-blacklist": require("./at-import-partial-extension-blacklist"),
  "at-import-partial-extension-whitelist": require("./at-import-partial-extension-whitelist"),
  "at-import-partial-extension": require("./at-import-partial-extension"),
  "at-mixin-argumentless-call-parentheses": require("./at-mixin-argumentless-call-parentheses"),
  "at-mixin-named-arguments": require("./at-mixin-named-arguments"),
  "at-mixin-parentheses-space-before": require("./at-mixin-parentheses-space-before"),
  "at-mixin-pattern": require("./at-mixin-pattern"),
  "at-rule-conditional-no-parentheses": require("./at-rule-conditional-no-parentheses"),
  "at-rule-no-unknown": require("./at-rule-no-unknown"),
  "at-use-no-redundant-alias": require("./at-use-no-redundant-alias"),
  "at-use-no-unnamespaced": require("./at-use-no-unnamespaced"),
  "comment-no-empty": require("./comment-no-empty"),
  "comment-no-loud": require("./comment-no-loud"),
  "declaration-nested-properties-no-divided-groups": require("./declaration-nested-properties-no-divided-groups"),
  "declaration-nested-properties": require("./declaration-nested-properties"),
  "dimension-no-non-numeric-values": require("./dimension-no-non-numeric-values"),
  "dollar-variable-colon-newline-after": require("./dollar-variable-colon-newline-after"),
  "dollar-variable-colon-space-after": require("./dollar-variable-colon-space-after"),
  "dollar-variable-colon-space-before": require("./dollar-variable-colon-space-before"),
  "dollar-variable-default": require("./dollar-variable-default"),
  "dollar-variable-empty-line-after": require("./dollar-variable-empty-line-after"),
  "dollar-variable-empty-line-before": require("./dollar-variable-empty-line-before"),
  "dollar-variable-first-in-block": require("./dollar-variable-first-in-block"),
  "dollar-variable-no-missing-interpolation": require("./dollar-variable-no-missing-interpolation"),
  "dollar-variable-no-namespaced-assignment": require("./dollar-variable-no-namespaced-assignment"),
  "dollar-variable-pattern": require("./dollar-variable-pattern"),
  "double-slash-comment-empty-line-before": require("./double-slash-comment-empty-line-before"),
  "double-slash-comment-inline": require("./double-slash-comment-inline"),
  "double-slash-comment-whitespace-inside": require("./double-slash-comment-whitespace-inside"),
  "function-disallowed-list": require("./function-disallowed-list"),
  "function-calculation-no-interpolation": require("./function-calculation-no-interpolation"),
  "function-color-relative": require("./function-color-relative"),
  "function-no-unknown": require("./function-no-unknown"),
  "function-quote-no-quoted-strings-inside": require("./function-quote-no-quoted-strings-inside"),
  "function-unquote-no-unquoted-strings-inside": require("./function-unquote-no-unquoted-strings-inside"),
  "map-keys-quotes": require("./map-keys-quotes"),
  "media-feature-value-dollar-variable": require("./media-feature-value-dollar-variable"),
  "no-dollar-variables": require("./no-dollar-variables"),
  "no-duplicate-dollar-variables": require("./no-duplicate-dollar-variables"),
  "no-duplicate-mixins": require("./no-duplicate-mixins"),
  "no-global-function-names": require("./no-global-function-names"),
  "operator-no-newline-after": require("./operator-no-newline-after"),
  "operator-no-newline-before": require("./operator-no-newline-before"),
  "operator-no-unspaced": require("./operator-no-unspaced"),
  "partial-no-import": require("./partial-no-import"),
  "percent-placeholder-pattern": require("./percent-placeholder-pattern"),
  "selector-nest-combinators": require("./selector-nest-combinators"),
  "selector-no-redundant-nesting-selector": require("./selector-no-redundant-nesting-selector"),
  "selector-no-union-class-name": require("./selector-no-union-class-name")
};

module.exports = rules;
