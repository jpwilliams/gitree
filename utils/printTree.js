const chalk = require('chalk')
const path = require('path')

function makeLine (node) {
	let line = ''

	if (node.type === 'directory') {
		line += chalk.bold.blue(node.name)
	} else {
		if (!node.x && !node.y) {
			line += node.name
		} else {
			if (node.x === 'A') {
				line +=
					chalk.green(node.name) +
					(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
					(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '') +
					chalk.dim(' (new file)')
			} else if (node.x === 'M' || node.y === 'M') {
				line +=
					chalk.yellow(node.name) +
					(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
					(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '')
			} else if (node.y === 'D' || node.x === 'D') {
				line +=
					chalk.red(node.name) +
					(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
					(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '') +
					chalk.dim(' (deleted)')
			} else if (node.x === 'R') {
				line +=
					chalk.yellow.italic(node.name) +
					(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
					(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '') +
					chalk.dim(` (renamed from "${path.relative(path.dirname(node.to), node.from)}")`)
			} else if (node.x === '?' || node.y === '?') {
				line +=
					chalk.dim(node.name) +
					(node.added ? ` ${chalk.green(`+${node.added}`)}` : '') +
					(node.deleted ? ` ${chalk.red(`-${node.deleted}`)}` : '') +
					chalk.dim(' (untracked)')
			}
		}
	}

	return line
}

function printTree (tree, collapse, level = 0, prefix = '') {
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

		console.log(prefix + pointer + line)

		if (node.contents && node.contents.length) {
			let newPrefix = prefix
			if (level) newPrefix += `${i === len ? ' ' : '│'}   `

			printTree(node.contents, collapse, level + 1, newPrefix)
		}
	})
}

module.exports = printTree
