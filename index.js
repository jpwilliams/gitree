#! /usr/bin/env node

const version = require('./package.json').version
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const parseGitStatus = require('parse-git-status')
const _ = require('lodash')
const program = require('commander')

program
  .version(version)
  .usage('[options]')
  .option('-m, --modified', 'Only show modified files')
  .parse(process.argv)

const cmd = 'git ls-files --exclude-standard --directory --no-empty-directory'

gitree('./')

async function gitree (p) {
  const statuses = {}

  try {
    const { stdout: statusOut } = await execa.shell('git status --porcelain -z')
    const gitStatuses = parseGitStatus(statusOut)

    gitStatuses.forEach((status) => {
      statuses[status.to] = status
    })
  } catch (e) {}

  try {
    var { stdout: filesOut } = await execa.shell(cmd + (program.modified ? ' -m' : ''))
  } catch (e) {}

  if (!filesOut) {
    return console.log('No git repository found.')
  }

  const data = filesOut.split('\n').map((file) => {
    return './' + file
  }).reduce((files, file, i) => {
    const split = file.split(path.sep)
    const fileName = split.pop()
    const target = split.length ? getFileTarget(files, split) : files
    target.push({name: fileName, type: 'file', path: file})

    return files
  }, [])

  looper('', statuses, data)
}

function getFileTarget (list, dirs) {
  const dir = dirs.shift()
  if (!dir) return list

  const foundDir = _.find(list, (file) => {
    return (file.type === 'directory' && file.name === dir)
  })

  if (foundDir) {
    return getFileTarget(foundDir.contents, dirs)
  }

  list.push({
    type: 'directory',
    name: dir,
    contents: []
  })

  return getFileTarget(list[list.length - 1].contents, dirs)
}

function looper (prefix, statuses, nodes, level = 0) {
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

      looper(newPrefix, statuses, node.contents, level + 1)
    }
  })
}
