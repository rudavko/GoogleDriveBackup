const uploading = new Set([])
exports.upload = ({ auth, config, files } = {}) => {
  if (!auth) return Promise.reject(new Error('The upload module did not receive the auth'))
  if (!config) return Promise.reject(new Error('The upload module did not receive the config'))

  if (files && files.length > 0) {
    files.forEach(file => {
      if (uploading.size < (config.maxConcurent || 4)) {
        uploading.add(file)
        console.log(file, ' started uploading')
      } else {
        console.log(file, ' put in queue')
      }
    })
  }
  return Promise.resolve('good')
}
