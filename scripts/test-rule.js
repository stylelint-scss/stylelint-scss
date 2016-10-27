// A helper script for testing rules
// So that we could just run "npm run test-rule partial-no-import"

const exec = require("child_process").exec
const env = process.env
env.FORCE_COLOR = 1

process.argv.slice(2).forEach(function (arg) {
  const cmd = "\"./node_modules/.bin/tape\" -r babel-register \"src/rules/" + arg + "/__tests__/index.js\" | \"./node_modules/.bin/tap-spec\""
  const child = exec(
    cmd,
    env
  )

  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
})
