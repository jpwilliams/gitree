const execa = require('execa')
const parseGitStatus = require('parse-git-status')

async function getGitStatuses () {
  const statuses = {}

  try {
    const { stdout: statusOut } = await execa.shell('git status --porcelain -z')
    const gitStatuses = parseGitStatus(statusOut)

    gitStatuses.forEach((status) => {
      statuses[status.to] = status
    })
  } catch (e) {}

  return statuses
}

module.exports = getGitStatuses
