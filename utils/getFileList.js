const execa = require('execa')
const processFiles = require('./processFiles')
const cmd = 'git ls-files --exclude-standard --directory --no-empty-directory'

async function getFileList (onlyModified) {
  const files = await Promise.all([
    runCmdSwallowErr(`${cmd}${onlyModified ? ' -m' : ''}`),
    runCmdSwallowErr(`${cmd} -o`)
  ])

  const sortedFiles = files
    .join('\n')
    .trim()
    .split('\n')
    .sort()

  const data = processFiles(sortedFiles)

  return data
}

async function runCmdSwallowErr (cmd) {
  try {
    var { stdout } = await execa.shell(cmd)
  } catch (e) {}

  return stdout || ''
}

module.exports = getFileList
