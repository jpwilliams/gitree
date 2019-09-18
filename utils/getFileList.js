const execa = require('execa')
const path = require('path')

const cmd = 'git ls-files --exclude-standard -co --full-name'

async function getFileList (p) {
	try {
		var { stdout: files } = await execa.shell(cmd, {
			cwd: path.resolve(process.cwd(), p)
		})
	} catch (e) {}

	if (!files) {
		return []
	}

	return files.split('\n').sort()
}

module.exports = getFileList
