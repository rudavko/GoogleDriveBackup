const uploading = []
exports.upload = ({ auth, config, files } = {}) => {
  if (!auth) return Promise.reject(new Error('The upload module did not receive the auth'))
  if (!config) return Promise.reject(new Error('The upload module did not receive the config'))

  if (files && files.length > 0) {
    files.forEach(file => {
      if (uploading.length < (config.maxConcurent || 4)) {
        uploading.push(file)
        console.log(file, ' started uploading')
      } else {
        console.log(file, ' put in queue')
      }
    })
  }
  return Promise.resolve('good')
}
