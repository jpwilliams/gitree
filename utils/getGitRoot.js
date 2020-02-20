const execa = require('execa')
const path = require('path')

async function getGitRoot (p) {
	const { stdout: gitRoot } = await execa.command('git rev-parse --show-toplevel', {
		cwd: path.resolve(process.cwd(), p),
		shell: true
	})

	return gitRoot
}

module.exports = getGitRoot
