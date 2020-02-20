const execa = require('execa')
const path = require('path')

// TODO Also run git diff --numstat -z --cached . to get staged commits (renamed files etc)
async function getGitLineChanges (p) {
	let statusOutDiff, statusOutCached

	try {
		;([{ stdout: statusOutDiff }, { stdout: statusOutCached }] = await Promise.all([
			execa.command('git diff --numstat -z .', { cwd: path.resolve(process.cwd(), p), shell: true }),
			execa.command('git diff --numstat -z --cached .', { cwd: path.resolve(process.cwd(), p), shell: true })
		]))
	} catch (e) {
		return {}
	}

	const parsedDiff = parseDiffString(statusOutDiff)
	const parsedCachedDiff = parseDiffString(statusOutCached)

	Object.assign(parsedDiff, parsedCachedDiff)

	return parsedDiff
}

function parseDiffString (str) {
	const splitStatus = str.split(/(?=[\t\0])/g)

	let addedLines, deletedLines, fileName, ignoreNext

	const statuses = splitStatus.reduce((statuses, section) => {
		if (ignoreNext) {
			ignoreNext = false

			return statuses
		}

		const startsWithTab = section.startsWith('\t')
		const startsWithNul = section.startsWith('\0')

		if (!startsWithTab && !startsWithNul) {
			// Start of the string
			fileName = ''
			deletedLines = ''
			addedLines = parseInt(section.trim())

			return statuses
		}

		if (startsWithTab) {
			if (deletedLines === '') {
				deletedLines = parseInt(section.trim())

				return statuses
			}

			if (section.trim() === '') {
				// we've got a renamed/copied file next!
				ignoreNext = true

				return statuses
			}

			fileName = section.trim()

			return statuses
		}

		if (startsWithNul) {
			if (fileName) {
				// could be new file
				statuses[fileName] = {
					added: addedLines,
					deleted: deletedLines
				}

				fileName = ''
				addedLines = parseInt(section.replace('\0', ''))
				deletedLines = ''
			} else {
				fileName = section.replace('\0', '')
			}

			return statuses
		}
	}, {})

	return statuses
}

module.exports = getGitLineChanges
