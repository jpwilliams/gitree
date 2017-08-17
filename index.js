#! /usr/bin/env node

// switch to use TREE for all of this
// tree -C -I $((cat .gitignore 2> /dev/null || cat $(git rev-parse --show-toplevel 2> /dev/null)/.gitignore 2> /dev/null || echo "node_modules") | egrep -v "^#.*$|^[[:space:]]*$" | tr "\\n" "|" | rev | cut -c 2- | rev) -Jf

const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const parseGitStatus = require('parse-git-status')
const cmd = 'tree -C -I $((cat .gitignore 2> /dev/null || cat $(git rev-parse --show-toplevel 2> /dev/null)/.gitignore 2> /dev/null || echo "node_modules") | egrep -v "^#.*$|^[[:space:]]*$" | tr "\\n" "|" | rev | cut -c 2- | rev) -Jf'

async function gitree (p) {
  try {
    const [
      { stdout: treeOut },
      { stdout: statusOut }
    ] = await Promise.all([
      execa.shell(cmd),
      execa.shell('git status --porcelain -z')
    ])

    const gitStatuses = parseGitStatus(statusOut)
    var statuses = {}

    gitStatuses.forEach((status) => {
      statuses[status.to] = status
    })

    var data = JSON.parse(treeOut)
  } catch (e) {
    console.log(e)
  }

  return looper(false, statuses, data)
}

function looper (lastParent, statuses, nodes, level = 0) {
  let str = ''
  let prefix = ''

  if (level) {
    if (level > 1) prefix += '│   '
    // prefix += '    '.repeat(Math.max(level - 2, 0))
  }

  const len = (level === 0 && nodes.length === 2) ? 0 : (nodes.length - 1)

  // the prefixes here need passing down to each looper
  // call.
  // this will resolve issues.
  nodes.forEach((node, i) => {
    let postPrefix = ''

    if (len > 0) {
      if (level > 2) {
        if (lastParent) {
          postPrefix += '    '
        } else {
          postPrefix += '│   '
        }
      }

      if (i === len) {
        postPrefix += '└── '
      } else {
        postPrefix += '├── '
      }
    } else {
      if (level) {
        postPrefix += '└── '
      } else {
        postPrefix += ''
      }
    }

    let addition = ''

    switch (node.type) {
      case 'directory':
        addition += chalk.bold.blue(path.basename(node.name))
        break
      case 'file':
        addition += path.basename(node.name)
        const cutName = node.name.substr(2)

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

    console.log(prefix + postPrefix + addition)

    if (node.contents && node.contents.length) {
      looper(i === len, statuses, node.contents, level + 1)
    }
  })
}

;(async () => {
  await gitree('./')
})()
