const req = require("request")
const semver = require("semver")
const replace = require("replace")
const _ = require("lodash")

const badgeRegex = /\[!\[v\d\.\d\.\d\sprogress\]\(http:\/\/progressed\.io\/bar\/\d{1,3}\?title=v\d\.\d\.\d\)\]\(https:\/\/github.com\/kristerkari\/stylelint-scss\/milestones\/\d\.\d\.\d\)/

const options = {
  url: "https://api.github.com/repos/kristerkari/stylelint-scss/milestones",
  headers: {
    "User-Agent": "request",
  },
}

req.get(options, (err, resp) => {
  if (err) { throw err }
  if (!resp.body) { return }

  const body = JSON.parse(resp.body)

  if (!_.isArray(body)) { return }

  const openMilestones = _.filter(body, (m) => m.open_issues > 0 && m.state !== "closed")

  if (!openMilestones.length) { return }

  const versions = _.map(openMilestones, (m) => m.title)
  const newestVersion = semver.maxSatisfying(versions, "*").replace(/$v/, "")
  const newestMilestone = _.find(body, (m) => m.title === newestVersion)
  const totalIssues = newestMilestone.open_issues + newestMilestone.closed_issues
  const percentage = newestMilestone.closed_issues / totalIssues * 100

  const badge = `[![v${newestVersion} progress](http://progressed.io/bar/${percentage}?title=v${newestVersion})](https://github.com/kristerkari/stylelint-scss/milestones/${newestVersion})`

  replace({
    regex: badgeRegex,
    replacement: badge,
    paths: ["README.md"],
    silent: true,
  })

})
