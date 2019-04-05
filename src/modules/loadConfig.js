const { config } = require('../../config.js')
const fs = require('fs')
const CREDENTIALS_PATH = './credentials.json'
const TOKEN_PATH = './token.json'
const SCOPE = 'https://www.googleapis.com/auth/drive.file'

const loadConfig = ({ fs, config }) => {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    return Promise.reject(
      new Error('Credentials file "credentials.json" was not found at root of the project'))
  }

  const credentialsString = fs.readFileSync(CREDENTIALS_PATH)
  try {
    config.credentials = JSON.parse(credentialsString).installed
  } catch (e) {
    return Promise.reject(new Error('Could not parse "credentials.json" file, it was in-credible'))
  }
  if (fs.existsSync(TOKEN_PATH)) {
    const tokenString = fs.readFileSync(TOKEN_PATH)
    try {
      config.token = JSON.parse(tokenString).refresh_token
    } catch (e) {
      console.log('Could not parse "token.json" file')
    }
  }
  config.scope = SCOPE
  return Promise.resolve(config)
}

exports.loadConfigClean = loadConfig
exports.loadConfig = () => loadConfig({ fs, config })
