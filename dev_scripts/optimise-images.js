const fs = require("fs")
const path = require("path")
const sharp = require("sharp")

let imgFolderPath = path.join(__dirname, "..", "public", "img")

let imageFiles = fs.readdirSync(imgFolderPath)

const getFileName = (fileStr) => {
	let index = fileStr.indexOf(".")
	if (index === -1) index = fileStr.length;
	return fileStr.substring(0, index)
}

imageFiles.filter((file) => file.endsWith(".png") || file.endsWith(".jpg")).map(async (file, i) => {
	let fileName = getFileName(file).replace("\\", "")
	let outputFolderPath = path.join(imgFolderPath, fileName)
	if (!fs.existsSync(outputFolderPath)) fs.mkdirSync(outputFolderPath)
	const args = [
		path.join(imgFolderPath, file),
		path.join(outputFolderPath, `${fileName}.webp`)
	]
	const filePath = path.join(imgFolderPath, file)

	sharp(filePath)
		.toFile(path.join(outputFolderPath, file))

	sharp(filePath)
		.webp({quality: 90})
		.toFile(path.join(outputFolderPath, `${fileName}.webp`))

})