import { createPlugin } from "stylelint"
import rules from "./rules"

const namespace = "scss"

const rulesPlugins = Object.keys(rules).map(ruleName => {
  return createPlugin(`${namespace}/${ruleName}`, rules[ruleName])
})

export default rulesPlugins
