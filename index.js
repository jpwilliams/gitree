#! /usr/bin/env node

const path = require('path')
const version = require('./package.json').version
const microloader = require('microloader')
const program = require('commander')

const {
  getGitStatuses,
  getFileList,
  buildNodes,
  buildTree,
  filesFromGitStatus,
  printTree
} = microloader('.', {
  objectify: true,
  cwd: path.join(__dirname, 'utils')
})

program
  .version(version)
  .usage('[options] [dir]')
  .option('-m, --modified', 'only show modified files')
  .parse(process.argv)

gitree(program.args[0] || '.')

async function gitree (p) {
  let gitStatuses, files

  if (program.modified) {
    gitStatuses = await getGitStatuses(p)
    files = filesFromGitStatus(gitStatuses)
  } else {
    ;([
      gitStatuses,
      files
    ] = await Promise.all([
      getGitStatuses(p),
      getFileList(p)
    ]))
  }

  if (!files.length) {
    return
  }

  const nodes = await buildNodes(files, gitStatuses, p)
  const tree = buildTree(nodes, p)
  printTree(tree)
}
