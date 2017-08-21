const path = require('path')
const getFileTarget = require('./getFileTarget')

function processFiles (x) {
  return x
    .split('\n')
    .map((file) => {
      return './' + file
    })
    .reduce((files, file, i) => {
      const split = file.split(path.sep)
      const fileName = split.pop()
      const target = split.length ? getFileTarget(files, split) : files
      target.push({name: fileName, type: 'file', path: file})

      return files
    }, [])
}

module.exports = processFiles
