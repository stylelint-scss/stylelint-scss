const req = require("request")
const semver = require("semver")
const replace = require("replace")
const _ = require("lodash")

const badgeRegex = /\[!\[v\d{1,3}\.\d{1,3}\.\d{1,3}\sprogress\]\(http:\/\/progressed\.io\/bar\/\d{1,3}\?title=v\d{1,3}\.\d{1,3}\.\d{1,3}\)\]\(https:\/\/github.com\/kristerkari\/stylelint-scss\/milestones\/\d{1,3}\.\d{1,3}\.\d{1,3}\)/

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
  const newestVersion = semver.maxSatisfying(versions, "*")
  const newestMilestone = _.find(body, (m) => m.title === newestVersion)
  const totalIssues = newestMilestone.open_issues + newestMilestone.closed_issues
  const percentage = newestMilestone.closed_issues / totalIssues * 100
  const version = newestVersion.replace(/^v/, "")

  const badge = `[![v${version} progress](http://progressed.io/bar/${percentage}?title=v${version})](https://github.com/kristerkari/stylelint-scss/milestones/${version})`

  replace({
    regex: badgeRegex,
    replacement: badge,
    paths: ["README.md"],
    silent: true,
  })

})
