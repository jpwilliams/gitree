// adapted from https://github.com/alexanderjeurissen/ranger_devicons
const { extname } = require('path')
const devicons = require('../assets/devicons.json')

function devicon (name, isDirectory) {
	if (isDirectory) return ''

	const exactMatch = devicons.exact[name]
	if (exactMatch) return exactMatch

	const extension = devicons.extensions[extname(name)]
	if (extension) return extension

	return ''
}

module.exports = devicon
