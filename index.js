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
  printTree,
  getGitLineChanges
} = microloader('.', {
  objectify: true,
  cwd: path.join(__dirname, 'utils')
})

program
  .version(version)
  .usage('[options] [dir]')
  .option('-m, --modified', 'only show modified files')
  .option('-t, --tracked', 'only show tracked files')
  .parse(process.argv)

gitree(program.args[0] || '.')

async function gitree (p) {
  let gitStatuses, files, gitLineChanges

  if (program.modified) {
    ;([
      gitStatuses,
      gitLineChanges
    ] = await Promise.all([
      getGitStatuses(p).then((result) => {
        files = filesFromGitStatus(result)

        return result
      }),

      getGitLineChanges(p)
    ]))
  } else {
    ;([
      gitStatuses,
      files,
      gitLineChanges
    ] = await Promise.all([
      getGitStatuses(p),
      getFileList(p),
      getGitLineChanges(p)
    ]))
  }

  if (!files.length) {
    return
  }

  const nodes = await buildNodes(files, gitStatuses, gitLineChanges, p, program.tracked)
  const tree = buildTree(nodes, p)
  printTree(tree)
}
