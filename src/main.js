const fs = require('fs')
const flatten = require('array-flatten')
const { google } = require('googleapis')
const { rl } = require('./modules/rl')
const GoogleOAuth2 = google.auth.OAuth2

exports.launch = ({ loadConfig, getAuth, upload, getFilesList }) =>
  loadConfig()
    .then(config =>
      getFilesList({ fs, config, flatten })
        .then(files =>
          getAuth({ fs, config, GoogleOAuth2, rl })
            .then(auth =>
              upload({
                fs,
                auth,
                files,
                google,
                config,
                log: console.log }))))
    .catch(er => console.log(er))
