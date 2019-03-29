const main = require('./src/main')
const { loadConfig } = require('./src/modules/loadConfig')
const { getFilesList } = require('./src/modules/getFilesList')
const { getAuth } = require('./src/modules/getAuth')
const { upload } = require('./src/modules/upload')

main.launch(({ loadConfig, getAuth, getFilesList, upload }))
