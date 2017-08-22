const path = require('path')
const getFileTarget = require('./getFileTarget')

function buildTree (nodes, p) {
  const parsedNodes = nodes
    .reduce((nodes, node, i) => {
      const calculatedPath = path.relative(path.join(process.cwd(), p), node.to)
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

  const wrapper = path.relative(process.cwd(), path.join(process.cwd(), p)) || '.'

  return [{
    name: wrapper,
    type: 'directory',
    contents: parsedNodes
  }]
}

module.exports = buildTree
