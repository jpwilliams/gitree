const path = require('path')
const getFileTarget = require('./getFileTarget')

function buildTree (nodes, p) {
  const isAbsolute = path.isAbsolute(p)
  const basePath = isAbsolute ? p : path.join(process.cwd(), p)

  const parsedNodes = nodes
    .reduce((nodes, node, i) => {
      const calculatedPath = path.relative(basePath, node.to)
      const fakePath = calculatedPath

      const split = fakePath.split(path.sep)
      const fileName = split.pop()
      const target = split.length ? getFileTarget(nodes, split) : nodes

      target.push({
        ...node,
        name: fileName,
        type: 'file',
        path: fakePath
      })

      return nodes
    }, [])

  const wrapper = isAbsolute ? p : (path.relative(process.cwd(), basePath) || '.')

  return [{
    name: wrapper,
    type: 'directory',
    contents: parsedNodes
  }]
}

module.exports = buildTree
