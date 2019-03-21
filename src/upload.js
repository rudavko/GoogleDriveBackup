const uploading = new Set([])
const queue = new Set([])
let drive
const makeDrive = (google, auth) => {
  if (drive === undefined) {
    drive = google.drive({ version: 'v3', auth })
  }
  return drive
}
const addToUploadQueue = ({ max, file, drive, fs, log }) => {
  if (uploading.size < (max || 4)) {
    if (!uploading.has(file)) {
      uploading.add(file)
      log(file, 'started uploading')
      if (queue.has(file)) queue.delete(file)
      return drive.files.create(
        { requestBody: {},
          media: { body: fs.createReadStream(file) } })
        .then(() => {
          uploading.delete(file)
          log(file, 'finished uploading')
        })
        .then(() => {
          if (queue.size > 0) return addToUploadQueue({ max, file: [...queue].shift(), drive, fs, log })
        })
    }
  } else {
    if (!queue.has(file)) {
      log(file, 'put in queue')
      queue.add(file)
    }
  }
}
exports.upload = ({ auth, config, files, fs, google, log } = {}) => {
  if (!auth) return Promise.reject(new Error('The upload module did not receive the auth'))
  if (!config) return Promise.reject(new Error('The upload module did not receive the config'))
  const drive = makeDrive(google, auth)
  if (files && files.length > 0) {
    return Promise.all(files.map(file =>
      addToUploadQueue({ file, drive, fs, max: config.maxConcurent, log })
    ))
  }
}

exports.clearUploading = () => uploading.clear()
exports.clearQueue = () => queue.clear()
