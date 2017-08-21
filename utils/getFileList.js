const execa = require('execa')
const processFiles = require('./processFiles')
const cmd = 'git ls-files --exclude-standard -co'

async function getFileList () {
  try {
    var { stdout: files } = await execa.shell(cmd)
  } catch (e) {}

  return processFiles(files.split('\n').sort())
}

module.exports = getFileList
