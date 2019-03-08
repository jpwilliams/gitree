const path = require('path')
const getGitRoot = require('./getGitRoot')

async function buildNodes (files, statuses, p, trackedOnly) {
  const gitRoot = await getGitRoot(p)

  files = files.reduce((list, file) => {
    const ret = {
      to: path.join(gitRoot, file),
      from: null
    }

    if (statuses[file]) {
      if (trackedOnly && [statuses[file].x, statuses[file].y].includes('?')) {
        return list
      }

      if (statuses[file].from) {
        ret.from = path.join(gitRoot, statuses[file].from)
      }

      ret.x = statuses[file].x
      ret.y = statuses[file].y

      delete statuses[file]
    }

    list.push(ret)

    return list
  }, [])

  if (Object.keys(statuses).length) {
    Object.keys(statuses).forEach((status) => {
      if (trackedOnly && [statuses[status].x, statuses[status].y].includes('?')) {
        return
      }

      files.push({
        to: path.join(gitRoot, statuses[status].to),
        from: statuses[status].from ? path.join(gitRoot, statuses[status].from) : null,
        x: statuses[status].x,
        y: statuses[status].y
      })
    })
  }

  return files.sort((a, b) => {
    const pathA = a.to.toLowerCase()
    const pathB = b.to.toLowerCase()

    if (pathA < pathB) return -1
    if (pathA > pathB) return 1
    return 0
  })
}

module.exports = buildNodes
