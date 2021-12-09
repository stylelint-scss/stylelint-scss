/**
 * Returns the namespace of an imported module or `null` if missing.
 *
 * Example: no import found, possibly using global function
 * `@use "sass:color";`
 * `moduleNamespace(root, 'sass:map')` returns `null`
 *
 * Example: default namespace
 * `@use "sass:map";`
 * `moduleNamespace(root, 'sass:map')` returns `null`
 *
 * Example: no namespace
 * `@use "sass:map" as *;`
 * `moduleNamespace(root, 'sass:map')` returns '*'
 *
 * Example: custom namespace
 * `@use "sass:map" as ns;`
 * `moduleNamespace(root, 'sass:map')` returns 'ns'
 */
export function moduleNamespace(root, module) {
  const regExp = new RegExp(`["']${module}["']`);
  let moduleNamespace = null;

  root.walkAtRules("use", rule => {
    if (!regExp.test(rule.params)) {
      return;
    }

    const parts = rule.params.split(" as ");

    if (parts.length < 2) {
      return;
    }

    moduleNamespace = parts[1]
      .trim()
      .split(" ")[0]
      .trim();
  });

  return moduleNamespace;
}
