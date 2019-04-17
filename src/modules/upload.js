const path = require('path')

const uploading = new Set([])
const queue = new Set([])
let drive

const makeDrive = (google, auth) => {
  if (drive === undefined) {
    drive = google.drive({ version: 'v3', auth })
  }
  return drive
}

const addToUploadQueue = ({ max, deleteAfter, file, drive, fs, log }) => {
  if (uploading.size < (max || 4)) {
    if (!uploading.has(file)) {
      uploading.add(file)
      if (queue.has(file)) queue.delete(file)
      log(file, 'started uploading')
      return drive.files.create(
        {
          requestBody: {
            name: path.basename(file)
          },
          media: {
            body: fs.createReadStream(file)
          }
        })
        .then(() => {
          uploading.delete(file)
          if (deleteAfter) {
            fs.unlinkSync(file)
            log(file, 'finished uploading and was deleted')
          } else {
            log(file, 'finished uploading')
          }
        })
        .then(() => {
          if (queue.size > 0) {
            const nextInQueue = [...queue].shift()
            return addToUploadQueue({ max, deleteAfter, drive, fs, log, file: nextInQueue })
          } else if (uploading.size === 0) {
            log('All downloads finished. Exiting in 3 seconds')
            return new Promise((resolve, reject) => setTimeout(() => {
              resolve(true)
              process.exit()
            }, 3000))
          }
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
      addToUploadQueue({ file, drive, fs, log, max: config.maxConcurent, deleteAfter: config.deleteAfter })
    ))
  }
}

exports.clearUploading = () => uploading.clear()
