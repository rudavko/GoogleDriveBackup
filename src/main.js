exports.launch = ({ getConfig, getAuth, upload }) => {
  const config = getConfig()
  const auth = getAuth(config)
  upload({ auth, config })
}
