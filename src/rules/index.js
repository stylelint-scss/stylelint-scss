"use strict";

const rules = {
  "at-each-key-value-single-line": require("./at-each-key-value-single-line/index.js"),
  "at-else-closing-brace-newline-after": require("./at-else-closing-brace-newline-after/index.js"),
  "at-else-closing-brace-space-after": require("./at-else-closing-brace-space-after/index.js"),
  "at-else-empty-line-before": require("./at-else-empty-line-before/index.js"),
  "at-else-if-parentheses-space-before": require("./at-else-if-parentheses-space-before/index.js"),
  "at-extend-no-missing-placeholder": require("./at-extend-no-missing-placeholder/index.js"),
  "at-function-named-arguments": require("./at-function-named-arguments/index.js"),
  "at-function-parentheses-space-before": require("./at-function-parentheses-space-before/index.js"),
  "at-function-pattern": require("./at-function-pattern/index.js"),
  "at-if-closing-brace-newline-after": require("./at-if-closing-brace-newline-after/index.js"),
  "at-if-closing-brace-space-after": require("./at-if-closing-brace-space-after/index.js"),
  "at-if-no-null": require("./at-if-no-null/index.js"),
  "at-import-no-partial-leading-underscore": require("./at-import-no-partial-leading-underscore/index.js"),
  "at-import-partial-extension-blacklist": require("./at-import-partial-extension-blacklist/index.js"),
  "at-import-partial-extension-whitelist": require("./at-import-partial-extension-whitelist/index.js"),
  "at-import-partial-extension": require("./at-import-partial-extension/index.js"),
  "at-mixin-argumentless-call-parentheses": require("./at-mixin-argumentless-call-parentheses/index.js"),
  "at-mixin-named-arguments": require("./at-mixin-named-arguments/index.js"),
  "at-mixin-parentheses-space-before": require("./at-mixin-parentheses-space-before/index.js"),
  "at-mixin-pattern": require("./at-mixin-pattern/index.js"),
  "at-rule-conditional-no-parentheses": require("./at-rule-conditional-no-parentheses/index.js"),
  "at-rule-no-unknown": require("./at-rule-no-unknown/index.js"),
  "at-use-no-unnamespaced": require("./at-use-no-unnamespaced/index.js"),
  "comment-no-empty": require("./comment-no-empty/index.js"),
  "comment-no-loud": require("./comment-no-loud/index.js"),
  "declaration-nested-properties-no-divided-groups": require("./declaration-nested-properties-no-divided-groups/index.js"),
  "declaration-nested-properties": require("./declaration-nested-properties/index.js"),
  "dimension-no-non-numeric-values": require("./dimension-no-non-numeric-values/index.js"),
  "dollar-variable-colon-newline-after": require("./dollar-variable-colon-newline-after/index.js"),
  "dollar-variable-colon-space-after": require("./dollar-variable-colon-space-after/index.js"),
  "dollar-variable-colon-space-before": require("./dollar-variable-colon-space-before/index.js"),
  "dollar-variable-default": require("./dollar-variable-default/index.js"),
  "dollar-variable-empty-line-after": require("./dollar-variable-empty-line-after/index.js"),
  "dollar-variable-empty-line-before": require("./dollar-variable-empty-line-before/index.js"),
  "dollar-variable-first-in-block": require("./dollar-variable-first-in-block/index.js"),
  "dollar-variable-no-missing-interpolation": require("./dollar-variable-no-missing-interpolation/index.js"),
  "dollar-variable-no-namespaced-assignment": require("./dollar-variable-no-namespaced-assignment/index.js"),
  "dollar-variable-pattern": require("./dollar-variable-pattern/index.js"),
  "double-slash-comment-empty-line-before": require("./double-slash-comment-empty-line-before/index.js"),
  "double-slash-comment-inline": require("./double-slash-comment-inline/index.js"),
  "double-slash-comment-whitespace-inside": require("./double-slash-comment-whitespace-inside/index.js"),
  "function-color-relative": require("./function-color-relative/index.js"),
  "function-no-unknown": require("./function-no-unknown/index.js"),
  "function-quote-no-quoted-strings-inside": require("./function-quote-no-quoted-strings-inside/index.js"),
  "function-unquote-no-unquoted-strings-inside": require("./function-unquote-no-unquoted-strings-inside/index.js"),
  "map-keys-quotes": require("./map-keys-quotes/index.js"),
  "media-feature-value-dollar-variable": require("./media-feature-value-dollar-variable/index.js"),
  "no-dollar-variables": require("./no-dollar-variables/index.js"),
  "no-duplicate-dollar-variables": require("./no-duplicate-dollar-variables/index.js"),
  "no-duplicate-mixins": require("./no-duplicate-mixins/index.js"),
  "no-global-function-names": require("./no-global-function-names/index.js"),
  "operator-no-newline-after": require("./operator-no-newline-after/index.js"),
  "operator-no-newline-before": require("./operator-no-newline-before/index.js"),
  "operator-no-unspaced": require("./operator-no-unspaced/index.js"),
  "partial-no-import": require("./partial-no-import/index.js"),
  "percent-placeholder-pattern": require("./percent-placeholder-pattern/index.js"),
  "selector-nest-combinators": require("./selector-nest-combinators/index.js"),
  "selector-no-redundant-nesting-selector": require("./selector-no-redundant-nesting-selector/index.js"),
  "selector-no-union-class-name": require("./selector-no-union-class-name/index.js")
};

module.exports = rules;
