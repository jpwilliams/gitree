const path = require('path')
const execa = require('execa')
const parseGitStatus = require('parse-git-status')

async function getGitStatuses (p) {
  const statuses = {}

  try {
    const { stdout: statusOut } = await execa.shell(`git status --porcelain -z -uall .`, {
      cwd: path.resolve(process.cwd(), p)
    })

    const gitStatuses = parseGitStatus(statusOut)

    gitStatuses.forEach((status) => {
      statuses[status.to] = status
    })

    return statuses
  } catch (e) {
    return []
  }
}

module.exports = getGitStatuses
