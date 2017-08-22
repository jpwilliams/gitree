const path = require('path')
const getFileTarget = require('./getFileTarget')

function buildTree (nodes) {
  return nodes
    .reduce((nodes, node, i) => {
      const split = `./${node.to}`.split(path.sep)
      const fileName = split.pop()
      const target = split.length ? getFileTarget(nodes, split) : nodes
      target.push({...node, name: fileName, type: 'file', path: `./${node.to}`})

      return nodes
    }, [])
}

module.exports = buildTree
