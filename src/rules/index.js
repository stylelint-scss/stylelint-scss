const rules = {
  get "at-each-key-value-single-line"() {
    return import("./at-each-key-value-single-line/index.js").then(
      m => m.default
    );
  },
  get "at-else-closing-brace-newline-after"() {
    return import("./at-else-closing-brace-newline-after/index.js").then(
      m => m.default
    );
  },
  get "at-else-closing-brace-space-after"() {
    return import("./at-else-closing-brace-space-after/index.js").then(
      m => m.default
    );
  },
  get "at-else-empty-line-before"() {
    return import("./at-else-empty-line-before/index.js").then(m => m.default);
  },
  get "at-else-if-parentheses-space-before"() {
    return import("./at-else-if-parentheses-space-before/index.js").then(
      m => m.default
    );
  },
  get "at-extend-no-missing-placeholder"() {
    return import("./at-extend-no-missing-placeholder/index.js").then(
      m => m.default
    );
  },
  get "at-function-named-arguments"() {
    return import("./at-function-named-arguments/index.js").then(
      m => m.default
    );
  },
  get "at-function-parentheses-space-before"() {
    return import("./at-function-parentheses-space-before/index.js").then(
      m => m.default
    );
  },
  get "at-function-pattern"() {
    return import("./at-function-pattern/index.js").then(m => m.default);
  },
  get "at-if-closing-brace-newline-after"() {
    return import("./at-if-closing-brace-newline-after/index.js").then(
      m => m.default
    );
  },
  get "at-if-closing-brace-space-after"() {
    return import("./at-if-closing-brace-space-after/index.js").then(
      m => m.default
    );
  },
  get "at-if-no-null"() {
    return import("./at-if-no-null/index.js").then(m => m.default);
  },
  get "at-import-no-partial-leading-underscore"() {
    return import("./at-import-no-partial-leading-underscore/index.js").then(
      m => m.default
    );
  },
  get "load-no-partial-leading-underscore"() {
    return import("./load-no-partial-leading-underscore/index.js").then(
      m => m.default
    );
  },
  get "load-partial-extension"() {
    return import("./load-partial-extension/index.js").then(m => m.default);
  },
  get "at-import-partial-extension-allowed-list"() {
    return import("./at-import-partial-extension-allowed-list/index.js").then(
      m => m.default
    );
  },
  get "at-import-partial-extension-blacklist"() {
    return import("./at-import-partial-extension-blacklist/index.js").then(
      m => m.default
    );
  },
  get "at-import-partial-extension-disallowed-list"() {
    return import(
      "./at-import-partial-extension-disallowed-list/index.js"
    ).then(m => m.default);
  },
  get "at-import-partial-extension-whitelist"() {
    return import("./at-import-partial-extension-whitelist/index.js").then(
      m => m.default
    );
  },
  get "at-import-partial-extension"() {
    return import("./at-import-partial-extension/index.js").then(
      m => m.default
    );
  },
  get "at-mixin-argumentless-call-parentheses"() {
    return import("./at-mixin-argumentless-call-parentheses/index.js").then(
      m => m.default
    );
  },
  get "at-mixin-named-arguments"() {
    return import("./at-mixin-named-arguments/index.js").then(m => m.default);
  },
  get "at-mixin-parentheses-space-before"() {
    return import("./at-mixin-parentheses-space-before/index.js").then(
      m => m.default
    );
  },
  get "at-mixin-pattern"() {
    return import("./at-mixin-pattern/index.js").then(m => m.default);
  },
  get "at-mixin-no-risky-nesting-selector"() {
    return import("./at-mixin-no-risky-nesting-selector/index.js").then(
      m => m.default
    );
  },
  get "at-rule-conditional-no-parentheses"() {
    return import("./at-rule-conditional-no-parentheses/index.js").then(
      m => m.default
    );
  },
  get "at-root-no-redundant"() {
    return import("./at-root-no-redundant/index.js").then(m => m.default);
  },
  get "at-rule-no-unknown"() {
    return import("./at-rule-no-unknown/index.js").then(m => m.default);
  },
  get "at-use-no-redundant-alias"() {
    return import("./at-use-no-redundant-alias/index.js").then(m => m.default);
  },
  get "at-use-no-unnamespaced"() {
    return import("./at-use-no-unnamespaced/index.js").then(m => m.default);
  },
  get "block-no-redundant-nesting"() {
    return import("./block-no-redundant-nesting/index.js").then(m => m.default);
  },
  get "comment-no-empty"() {
    return import("./comment-no-empty/index.js").then(m => m.default);
  },
  get "comment-no-loud"() {
    return import("./comment-no-loud/index.js").then(m => m.default);
  },
  get "declaration-nested-properties-no-divided-groups"() {
    return import(
      "./declaration-nested-properties-no-divided-groups/index.js"
    ).then(m => m.default);
  },
  get "declaration-nested-properties"() {
    return import("./declaration-nested-properties/index.js").then(
      m => m.default
    );
  },
  get "declaration-property-value-no-unknown"() {
    return import("./declaration-property-value-no-unknown/index.js").then(
      m => m.default
    );
  },
  get "dimension-no-non-numeric-values"() {
    return import("./dimension-no-non-numeric-values/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-colon-newline-after"() {
    return import("./dollar-variable-colon-newline-after/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-colon-space-after"() {
    return import("./dollar-variable-colon-space-after/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-colon-space-before"() {
    return import("./dollar-variable-colon-space-before/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-default"() {
    return import("./dollar-variable-default/index.js").then(m => m.default);
  },
  get "dollar-variable-empty-line-after"() {
    return import("./dollar-variable-empty-line-after/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-empty-line-before"() {
    return import("./dollar-variable-empty-line-before/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-first-in-block"() {
    return import("./dollar-variable-first-in-block/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-no-missing-interpolation"() {
    return import("./dollar-variable-no-missing-interpolation/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-no-namespaced-assignment"() {
    return import("./dollar-variable-no-namespaced-assignment/index.js").then(
      m => m.default
    );
  },
  get "dollar-variable-pattern"() {
    return import("./dollar-variable-pattern/index.js").then(m => m.default);
  },
  get "double-slash-comment-empty-line-before"() {
    return import("./double-slash-comment-empty-line-before/index.js").then(
      m => m.default
    );
  },
  get "double-slash-comment-inline"() {
    return import("./double-slash-comment-inline/index.js").then(
      m => m.default
    );
  },
  get "double-slash-comment-whitespace-inside"() {
    return import("./double-slash-comment-whitespace-inside/index.js").then(
      m => m.default
    );
  },
  get "function-disallowed-list"() {
    return import("./function-disallowed-list/index.js").then(m => m.default);
  },
  get "function-calculation-no-interpolation"() {
    return import("./function-calculation-no-interpolation/index.js").then(
      m => m.default
    );
  },
  get "function-color-channel"() {
    return import("./function-color-channel/index.js").then(m => m.default);
  },
  get "function-color-relative"() {
    return import("./function-color-relative/index.js").then(m => m.default);
  },
  get "function-no-unknown"() {
    return import("./function-no-unknown/index.js").then(m => m.default);
  },
  get "function-quote-no-quoted-strings-inside"() {
    return import("./function-quote-no-quoted-strings-inside/index.js").then(
      m => m.default
    );
  },
  get "function-unquote-no-unquoted-strings-inside"() {
    return import(
      "./function-unquote-no-unquoted-strings-inside/index.js"
    ).then(m => m.default);
  },
  get "map-keys-quotes"() {
    return import("./map-keys-quotes/index.js").then(m => m.default);
  },
  get "media-feature-value-dollar-variable"() {
    return import("./media-feature-value-dollar-variable/index.js").then(
      m => m.default
    );
  },
  get "no-dollar-variables"() {
    return import("./no-dollar-variables/index.js").then(m => m.default);
  },
  get "no-duplicate-dollar-variables"() {
    return import("./no-duplicate-dollar-variables/index.js").then(
      m => m.default
    );
  },
  get "no-duplicate-mixins"() {
    return import("./no-duplicate-mixins/index.js").then(m => m.default);
  },
  get "no-global-function-names"() {
    return import("./no-global-function-names/index.js").then(m => m.default);
  },
  get "no-unused-private-members"() {
    return import("./no-unused-private-members/index.js").then(m => m.default);
  },
  get "operator-no-newline-after"() {
    return import("./operator-no-newline-after/index.js").then(m => m.default);
  },
  get "operator-no-newline-before"() {
    return import("./operator-no-newline-before/index.js").then(m => m.default);
  },
  get "operator-no-unspaced"() {
    return import("./operator-no-unspaced/index.js").then(m => m.default);
  },
  get "partial-no-import"() {
    return import("./partial-no-import/index.js").then(m => m.default);
  },
  get "percent-placeholder-pattern"() {
    return import("./percent-placeholder-pattern/index.js").then(
      m => m.default
    );
  },
  get "property-no-unknown"() {
    return import("./property-no-unknown/index.js").then(m => m.default);
  },
  get "selector-nest-combinators"() {
    return import("./selector-nest-combinators/index.js").then(m => m.default);
  },
  get "selector-no-redundant-nesting-selector"() {
    return import("./selector-no-redundant-nesting-selector/index.js").then(
      m => m.default
    );
  },
  get "selector-no-union-class-name"() {
    return import("./selector-no-union-class-name/index.js").then(
      m => m.default
    );
  }
};

export default rules;
