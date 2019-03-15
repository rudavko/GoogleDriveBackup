const authUrl = 'https://fjjjfjdkkjkfjdkj'
const oauth2Client = {
  abc: 123,
  setCredentials: jest.fn(),
  generateAuthUrl: jest.fn(() => authUrl),
  getToken: jest.fn()
}
const SCOPE = ['https://www.googleapis.com/auth/drive.file']

const GoogleOAuth2 = jest.fn(() => oauth2Client)
const { auth } = require('../src/auth')
const rl = {
  question: jest.fn(),
  close: jest.fn()
}
jest.spyOn(global.console, 'log')

describe('general tests', () => {
  it('checks config', done => {
    auth()
      .catch(er => {
        expect(er).toEqual(new Error('No config specified'))
        done()
      })
  })
  it('returns error on no credentials', done => {
    auth({ config: {} })
      .catch(er => {
        expect(er).toEqual(new Error('No credentials found in the config'))
        done()
      })
  })
  const config = {
    credentials: {
      client_id: 123,
      client_secret: 'fdhslaf',
      redirect_uris: ['zzrfdsjakl']
    }
  }
  it('creates an oauth2 client', done => {
    auth({ config, GoogleOAuth2 })
      .then(x => {
        expect(GoogleOAuth2)
          .toBeCalledWith(
            config.credentials.client_id,
            config.credentials.client_secret,
            config.credentials.redirect_uris[0])
        expect(x).toEqual(oauth2Client)
        done()
      })
  })
  it('sets credentials if token is passed with confit', done => {
    config.token = 'huiwefhwefhjwefowefophwefweiofp'
    auth({ config, GoogleOAuth2 })
      .then(x => {
        expect(oauth2Client.setCredentials).toBeCalledWith(config.token)
        expect(x).toEqual(oauth2Client)
        delete config.token
        done()
      })
  })
  it('calls generate URL fine', done => {
    config.scope = SCOPE
    auth({ config, GoogleOAuth2 })
      .then(x => {
        expect(oauth2Client.generateAuthUrl).toBeCalledWith({
          access_type: 'offline',
          scope: SCOPE
        })
        done()j
      })
  })
  it('outputs url fine', done => {
    auth({ config, GoogleOAuth2, rl })
      .then(x => {
        expect(console.log).toBeCalledWith(authUrl)
        done()
      })
  })
  it('', () => {
    expect().to
  })
})
