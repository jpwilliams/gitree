#! /usr/bin/env node

const path = require('path')
const version = require('./package.json').version
const microloader = require('microloader')
const program = require('commander')

const {
  getGitStatuses,
  getFileList,
  looper
} = microloader('.', {
  objectify: true,
  cwd: path.join(__dirname, 'utils')
})

program
  .version(version)
  .usage('[options]')
  .option('-m, --modified', 'Only show modified files')
  .parse(process.argv)

gitree('./')

async function gitree (p) {
  const data = await Promise.all([
    getGitStatuses(),
    getFileList(program.modified)
  ])

  looper(...data)
}
