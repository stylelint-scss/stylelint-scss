import ruleTester from "stylelint-rule-tester"
import scss from "postcss-scss"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName, {
  postcssOptions: { syntax: scss },
})

testRule(undefined, tr => {
  tr.ok("div { color: #f00; }")
  tr.notOk("div.class { font-family: Arial; }", messages.rejected("font-family"))
  tr.notOk("div, body { font-family: Arial; }", messages.rejected("font-family"))
  tr.notOk("body, div { font: italic 20px sans-serif; }", messages.rejected("font"))
  tr.notOk(".class { font-family: Arial; }", messages.rejected("font-family"))
  tr.notOk(".class { font-weight: 600; }", messages.rejected("font-weight"))
  tr.notOk(".class { font-size: 1em; }", messages.rejected("font-size"))
  tr.notOk(".class { font-style: italic; }", messages.rejected("font-style"))
  tr.notOk(".class { font: italic 20px sans-serif; }", messages.rejected("font"))
})
