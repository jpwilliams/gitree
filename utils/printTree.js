const path = require('path')
const chalk = require('chalk')

function printTree (tree, level = 0, prefix = '') {
  const len = tree.length - 1

  tree.forEach((node, i) => {
    let line = ''

    if (node.type === 'directory') {
      line += chalk.bold.blue(node.name)
    } else {
      if (!node.x && !node.y) {
        line += node.name
      } else {
        if (node.x === 'A') {
          line += chalk.green(node.name) + (node.hasOwnProperty('added') ? ` ${chalk.green(`+${node.added}`)} ${chalk.red(`-${node.deleted}`)}` : '') + chalk.dim(' (new file)')
        } else if (node.x === 'M' || node.y === 'M') {
          line += chalk.yellow(node.name) + (node.hasOwnProperty('added') ? ` ${chalk.green(`+${node.added}`)} ${chalk.red(`-${node.deleted}`)}` : '')
        } else if (node.y === 'D' || node.x === 'D') {
          line += chalk.red(node.name) + (node.hasOwnProperty('added') ? ` ${chalk.green(`+${node.added}`)} ${chalk.red(`-${node.deleted}`)}` : '') + chalk.dim(' (deleted)')
        } else if (node.x === 'R') {
          line += chalk.yellow.italic(node.name) + (node.hasOwnProperty('added') ? ` ${chalk.green(`+${node.added}`)} ${chalk.red(`-${node.deleted}`)}` : '') + chalk.dim(` (renamed from "${path.relative(path.dirname(node.to), node.from)}")`)
        } else if (node.x === '?' || node.y === '?') {
          line += chalk.dim(node.name) + (node.hasOwnProperty('added') ? ` ${chalk.green(`+${node.added}`)} ${chalk.red(`-${node.deleted}`)}` : '') + chalk.dim(' (untracked)')
        }
      }
    }

    const pointer = level > 0 ? (len > 0 ? (i === len ? '└── ' : '├── ') : (level ? '└── ' : '')) : ''

    console.log(prefix + pointer + line)

    if (node.contents && node.contents.length) {
      let newPrefix = prefix
      if (level) newPrefix += `${i === len ? ' ' : '│'}   `

      printTree(node.contents, level + 1, newPrefix)
    }
  })
}

module.exports = printTree
