const execa = require('execa')

async function getGitRoot () {
  const { stdout: gitRoot } = await execa.shell('git rev-parse --show-toplevel')

  return gitRoot
}

module.exports = getGitRoot
