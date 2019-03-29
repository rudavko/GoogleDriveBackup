const { config } = require('../../config')
const fs = require('fs')
const CREDENTIALS_PATH = './credentials.json'
const SCOPE = 'https://www.googleapis.com/auth/drive.file'
exports.loadConfig = () => {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    return Promise.reject(
      new Error('Credentials file "credentials.json" was not found at root of the project'))
  }
  const credentialsString = fs.readFileSync(CREDENTIALS_PATH)
  try {
    config.credentials = JSON.parse(credentialsString).web
  } catch (e) {
    return Promise.reject(new Error('Could not parse "credentials.json" file, it was in-credible'))
  }
  config.scope = SCOPE
  return Promise.resolve(config)
}
