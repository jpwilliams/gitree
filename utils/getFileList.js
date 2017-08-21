const execa = require('execa')
const processFiles = require('./processFiles')
const cmd = 'git ls-files --exclude-standard --directory --no-empty-directory'

async function getFileList (onlyModified) {
  const files = await Promise.all([
    runCmdSwallowErr(`${cmd}${onlyModified ? ' -m' : ''}`),
    runCmdSwallowErr(`${cmd} -o`)
  ])

  const trimmedOutput = files.join('\n').trim()
  if (!trimmedOutput) return []

  return processFiles(trimmedOutput.split('\n').sort())
}

async function runCmdSwallowErr (cmd) {
  try {
    var { stdout } = await execa.shell(cmd)
  } catch (e) {}

  return stdout || ''
}

module.exports = getFileList
