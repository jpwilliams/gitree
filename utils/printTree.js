const chalk = require('chalk')
const path = require('path')
const devicon = require('./devicon')

function makeLine (node) {
	if (node.type === 'directory') {
		return chalk.bold.blue(node.name)
	}

	if (!node.x && !node.y) {
		return node.name
	}

	if (node.x === 'A') {
		return chalk.green(node.name) +
			(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
			(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '') +
			chalk.dim(' (new file)')
	} else if (node.x === 'M' || node.y === 'M') {
		return chalk.yellow(node.name) +
			(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
			(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '')
	} else if (node.y === 'D' || node.x === 'D') {
		return chalk.red(node.name) +
			(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
			(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '') +
			chalk.dim(' (deleted)')
	} else if (node.x === 'R') {
		return chalk.yellow.italic(node.name) +
			(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
			(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '') +
			chalk.dim(` (renamed from "${path.relative(path.dirname(node.to), node.from)}")`)
	} else if (node.x === '?' || node.y === '?') {
		return chalk.dim(node.name) +
			(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
			(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '') +
			chalk.dim(' (untracked)')
	}

	return ''
}

function printTree (tree, collapse, addDevicons, level = 0, prefix = '') {
	const len = tree.length - 1

	tree.forEach((node, i) => {
		let line = makeLine(node)

		const pointer = level > 0 ? (len > 0 ? (i === len ? '└── ' : '├── ') : (level ? '└── ' : '')) : ''

		if (collapse) {
			while (node.contents && node.contents.length === 1) {
				node = node.contents[0]
				line += path.sep + makeLine(node)
			}
		}

		if (addDevicons) {
			line = `${devicon(node.name, node.type === 'directory')} ${line}`
		}

		console.log(prefix + pointer + line)

		if (node.contents && node.contents.length) {
			let newPrefix = prefix
			if (level) newPrefix += `${i === len ? ' ' : '│'}   `

			printTree(node.contents, collapse, addDevicons, level + 1, newPrefix)
		}
	})
}

module.exports = printTree
