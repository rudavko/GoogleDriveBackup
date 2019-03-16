const getToken = (oauth2Client, code) =>
  new Promise((resolve, reject) => {
    const callback = (err, token) => {
      if (err) reject(err)
      resolve(token)
    }
    return oauth2Client.getToken(code, callback)
  })
exports.auth = ({ config, GoogleOAuth2, rl } = {}) => {
  if (!config) return Promise.reject(new Error('No config specified'))
  if (!config.credentials) return Promise.reject(new Error('No credentials found in the config'))
  const oauth2Client = new GoogleOAuth2(
    config.credentials.client_id,
    config.credentials.client_secret,
    config.credentials.redirect_uris[0])
  if (config.token) {
    oauth2Client.setCredentials(config.token)
  } else {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.scope
    })
    console.log('Go here', authUrl)
    rl.question('Enter the code from the page here:')
      .then(code => {
        rl.close()
        return getToken(oauth2Client, code)
      })
      .then(token =>
        oauth2Client.setCredentials(token))
  }
  return Promise.resolve(oauth2Client)
}
