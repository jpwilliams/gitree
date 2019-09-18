const ignore = require('ignore')
const path = require('path')

const getFileTarget = require('./getFileTarget')

function buildTree (nodes, p, ignorePattern) {
	const ig = ignore()
	if (ignorePattern) ig.add(ignorePattern)

	const isAbsolute = path.isAbsolute(p)
	const basePath = isAbsolute ? p : path.join(process.cwd(), p)

	const parsedNodes = nodes
		.reduce((nodes, node, i) => {
			const calculatedPath = path.relative(basePath, node.to)

			if (ignorePattern) {
				const shouldBeIgnored = ig.ignores(calculatedPath)
				if (shouldBeIgnored) return nodes
			}

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
