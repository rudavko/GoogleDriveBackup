const loadConfig = require('../src/modules/loadConfig').loadConfigClean
const CREDENTIALS_PATH = './credentials.json'
const TOKEN_PATH = './token.json'
const SCOPE = 'https://www.googleapis.com/auth/drive.file'
jest.spyOn(global.console, 'log')
describe('loads config fine', () => {
  const config = {}
  it('returns error if credentials do not exist', done => {
    const fs = {
      existsSync: jest.fn()
    }
    loadConfig({ fs, config })
      .catch(er => {
        expect(fs.existsSync).toBeCalled()
        expect(er).toEqual(new Error('Credentials file "credentials.json" was not found at root of the project'))
        done()
      })
  })
  it('returns error if credentials are unparsable', done => {
    const fs = {
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn()
    }
    loadConfig({ fs, config })
      .catch(er => {
        expect(fs.existsSync).toBeCalledWith(CREDENTIALS_PATH)
        expect(er).toEqual(new Error('Could not parse "credentials.json" file, it was in-credible'))
        done()
      })
  })
  it('returns proper config object', done => {
    const fs = {
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(() => '{}')
    }
    loadConfig({ fs, config })
      .then(config => {
        expect(fs.existsSync).toBeCalledWith(CREDENTIALS_PATH)
        expect(fs.existsSync).toBeCalledWith(TOKEN_PATH)
        expect(fs.readFileSync).toBeCalledWith(CREDENTIALS_PATH)
        expect(config).toEqual({ credentials: undefined, scope: SCOPE })
        done()
      })
  })
  it('returns error on bad token file', done => {
    const fs = {
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(path => {
        if (path === TOKEN_PATH) {
          return '{'
        }
        if (path === CREDENTIALS_PATH) {
          return '{"installed":{"client_id":"ijijijji"}}'
        }
      })
    }
    loadConfig({ fs, config })
      .then(er => {
        expect(fs.existsSync).toBeCalledWith(CREDENTIALS_PATH)
        expect(fs.existsSync).toBeCalledWith(TOKEN_PATH)
        expect(fs.readFileSync).toBeCalledWith(CREDENTIALS_PATH)
        expect(console.log)
          .toBeCalledWith('Could not parse "token.json" file')
        done()
      })
  })
  it('returns proper config object', done => {
    const fs = {
      existsSync: jest.fn(() => true),
      readFileSync: jest.fn(path => {
        if (path === TOKEN_PATH) {
          return '{"refresh_token":"ererererere"}'
        }
        if (path === CREDENTIALS_PATH) {
          return '{"installed":{"client_id":"ijijijji"}}'
        }
      })
    }
    loadConfig({ fs, config })
      .then(config => {
        expect(fs.existsSync).toBeCalledWith(CREDENTIALS_PATH)
        expect(fs.existsSync).toBeCalledWith(TOKEN_PATH)
        expect(fs.readFileSync).toBeCalledWith(CREDENTIALS_PATH)
        expect(config).toEqual({ credentials: { 'client_id': 'ijijijji' }, scope: SCOPE, token: 'ererererere' })
        done()
      })
  })
})
