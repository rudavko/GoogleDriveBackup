exports.launch = ({ getConfig, getAuth, upload }) =>
  getConfig()
    .then(config =>
      getAuth(config)
        .then(auth =>
          upload({ auth, config })))
