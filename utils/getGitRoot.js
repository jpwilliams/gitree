const execa = require('execa')
const path = require('path')

async function getGitRoot (p) {
	const { stdout: gitRoot } = await execa.shell('git rev-parse --show-toplevel', {
		cwd: path.resolve(process.cwd(), p)
	})

	return gitRoot
}

module.exports = getGitRoot
