const execa = require('execa')
const path = require('path')

const cmd = 'git ls-files --exclude-standard -co --full-name'

async function getFileList (p) {
	try {
		var { stdout: files } = await execa.command(cmd, {
			cwd: path.resolve(process.cwd(), p),
			shell: true
		})
	} catch (e) {}

	if (!files) {
		return []
	}

	return files.split('\n').sort()
}

module.exports = getFileList
