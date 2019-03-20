const uploading = new Set([])
let drive
const makeDrive = (google, auth) => {
  if (drive === undefined) {
    drive = google.drive({ version: 'v3', auth })
  }
  return drive
}
exports.upload = ({ auth, config, files, fs, google, log } = {}) => {
  if (!auth) return Promise.reject(new Error('The upload module did not receive the auth'))
  if (!config) return Promise.reject(new Error('The upload module did not receive the config'))
  const drive = makeDrive(google, auth)
  if (files && files.length > 0) {
    files.forEach(file => {
      if (uploading.size < (config.maxConcurent || 4)) {
        if (!uploading.has(file)) {
          uploading.add(file)
          log(file, 'started uploading')
          drive.files.create(
            { requestBody: {},
              media: { body: fs.createReadStream(file) } })
            .then(data => log(file, 'finished uploading'))
        }
      } else {
        log(file, 'put in queue')
      }
    })
  }
  return Promise.resolve('good')
}

exports.clearUploading = () => uploading.clear()
