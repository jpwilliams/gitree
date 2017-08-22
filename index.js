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
  .usage('[options]')
  .option('-m, --modified', 'only show modified files')
  .parse(process.argv)

gitree()

async function gitree () {
  let gitStatuses, files

  if (program.modified) {
    gitStatuses = await getGitStatuses()
    files = filesFromGitStatus(gitStatuses)
  } else {
    ;([
      gitStatuses,
      files
    ] = await Promise.all([
      getGitStatuses(),
      getFileList()
    ]))
  }

  const nodes = buildNodes(files, gitStatuses)
  const tree = buildTree(nodes)
  printTree(tree)
}
