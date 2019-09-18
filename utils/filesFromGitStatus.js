function filesFromGitStatus (list) {
	return Object.keys(list).sort()
}

module.exports = filesFromGitStatus
