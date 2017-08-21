const execa = require('execa')
const processFiles = require('./processFiles')
const cmd = 'git ls-files --exclude-standard --directory --no-empty-directory'

async function getFileList (onlyModified) {
  try {
    var { stdout: filesOut } = await execa.shell(cmd + (onlyModified ? ' -m' : ''))
  } catch (e) {}

  if (!filesOut) {
    console.log('No git repository found.')

    return []
  }

  const data = processFiles(filesOut)

  return data
}

module.exports = getFileList
