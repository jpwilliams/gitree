const chalk = require('chalk')
const parseGitStatus = require('parse-git-status')

function looper (statuses, nodes, level = 0, prefix = '') {
  const len = nodes.length - 1

  nodes.forEach((node, i) => {
    let addition = ''

    switch (node.type) {
      case 'directory':
        addition += chalk.bold.blue(node.name)
        break
      case 'file':
        addition += node.name
        const cutName = node.path.substr(2)

        if (statuses[cutName]) {
          const { x, y } = statuses[cutName]

          if (x === 'A') {
            addition = chalk.green(addition) + chalk.dim(' - new file')
          } else if (x === 'M' || y === 'M') {
            addition = chalk.yellow(addition) + chalk.dim(' - ' + parseGitStatus.describeCode('M'))
          } else if (x === '?' || y === '?') {
            addition = chalk.dim(addition + ' - untracked')
          }
        }

        break
    }

    const postPrefix = level > 0 ? (len > 0 ? (i === len ? '└── ' : '├── ') : (level ? '└── ' : '')) : ''

    console.log(prefix + postPrefix + addition)

    if (node.contents && node.contents.length) {
      let newPrefix = prefix

      if (level) {
        if (i === (nodes.length - 1)) {
          // last item, so don't add lines
          newPrefix += '    '
        } else {
          // not last item, so add lines
          newPrefix += '│   '
        }
      }

      looper(statuses, node.contents, level + 1, newPrefix)
    }
  })
}

module.exports = looper
