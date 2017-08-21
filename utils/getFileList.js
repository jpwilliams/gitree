const execa = require('execa')
const processFiles = require('./processFiles')
const cmd = 'git ls-files --exclude-standard --directory --no-empty-directory'

async function getFileList (onlyModified) {
  const files = await Promise.all([
    getGitFiles(onlyModified),
    getUntrackedFiles()
  ])

  const sortedFiles = files
    .join('\n')
    .trim()
    .split('\n')
    .sort()

  const data = processFiles(sortedFiles)

  return data
}

async function getGitFiles (onlyModified) {
  try {
    var { stdout: filesOut } = await execa.shell(cmd + (onlyModified ? ' -m' : ''))
  } catch (e) {}

  if (!filesOut) {
    console.log('No files or no git repository found.')

    return ''
  }

  return filesOut
}

async function getUntrackedFiles () {
  try {
    var { stdout: filesOut } = await execa.shell(cmd + ' -o')
  } catch (e) {}

  return filesOut || ''
}

module.exports = getFileList
