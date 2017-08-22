const path = require('path')
const getGitRoot = require('./getGitRoot')

async function buildNodes (files, statuses, p) {
  const gitRoot = await getGitRoot(p)

  return files
    .map((file) => {
      const ret = {
        to: path.join(gitRoot, file),
        from: null
      }

      if (statuses[file]) {
        if (statuses[file].from) {
          ret.from = path.join(gitRoot, statuses[file].from)
        }

        ret.x = statuses[file].x
        ret.y = statuses[file].y
      }

      return ret
    })
}

module.exports = buildNodes
