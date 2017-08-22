function buildNodes (files, statuses) {
  return files
    .map((file) => {
      const ret = {
        to: file,
        from: null
      }

      if (statuses[file]) {
        ret.from = statuses[file].from
        ret.x = statuses[file].x
        ret.y = statuses[file].y
      }

      return ret
    })
}

module.exports = buildNodes
