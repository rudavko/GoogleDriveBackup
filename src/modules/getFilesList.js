
exports.getFilesList = ({ fs, config, flatten }) => {
  if (!config || !config.folders) {
    return Promise.reject(new Error('The config is empty'))
  }

  return Promise.all(config.folders.map(folder => {
    if (fs.existsSync(folder)) {
      return fs.readdirSync(folder)
        .map(file => `${folder}/${file}`)
    }
    return false
  }))
    .then(filesArray => flatten(filesArray),
      reason => console.log(reason))
}
