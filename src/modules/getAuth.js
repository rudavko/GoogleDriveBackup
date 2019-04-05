
exports.getAuth = ({ config, GoogleOAuth2, rl, fs } = {}) => {
  if (!config) return Promise.reject(new Error('No config specified'))
  if (!config.credentials) return Promise.reject(new Error('No credentials found in the config'))
  if (!config.scope) return Promise.reject(new Error('No scope found in the config'))

  const oauth2Client = new GoogleOAuth2(
    config.credentials.client_id,
    config.credentials.client_secret,
    config.credentials.redirect_uris[0])
  if (config.token) {
    oauth2Client.setCredentials({ refresh_token: config.token })
  } else {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.scope
    })
    console.log('Go here to authenticate', authUrl)
    return rl.question('Enter the code from the page here:')
      .then(code => {
        rl.readline.close()
        return oauth2Client.getToken(code)
      })
      .then(token => {
        const tokenText = JSON.stringify({ refresh_token: token.tokens.refresh_token })
        fs.writeFileSync('token.json', tokenText)
        oauth2Client.setCredentials({ refresh_token: token.tokens.refresh_token })
      })
      .then(() => oauth2Client)
  }
  return Promise.resolve(oauth2Client)
}
