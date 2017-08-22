const execa = require('execa')
const cmd = 'git ls-files --exclude-standard -co'

async function getFileList () {
  try {
    var { stdout: files } = await execa.shell(cmd)
  } catch (e) {}

  if (!files) {
    return []
  }

  return files.split('\n').sort()
}

module.exports = getFileList
