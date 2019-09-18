function getFileTarget (list, dirs) {
	const dir = dirs.shift()
	if (!dir) return list

	const foundDir = list.find((file) => {
		return (file.type === 'directory' && file.name === dir)
	})

	if (foundDir) {
		return getFileTarget(foundDir.contents, dirs)
	}

	list.push({
		type: 'directory',
		name: dir,
		contents: []
	})

	return getFileTarget(list[list.length - 1].contents, dirs)
}

module.exports = getFileTarget
