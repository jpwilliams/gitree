const execa = require('execa')
const parseGitStatus = require('parse-git-status')
const path = require('path')

async function getGitStatuses (p) {
	const statuses = {}

	try {
		const { stdout: statusOut } = await execa.command(`git status --porcelain -z -uall .`, {
			cwd: path.resolve(process.cwd(), p),
			shell: true
		})

		const gitStatuses = parseGitStatus(statusOut)

		gitStatuses.forEach((status) => {
			statuses[status.to] = status
		})

		return statuses
	} catch (e) {
		return []
	}
}

module.exports = getGitStatuses
