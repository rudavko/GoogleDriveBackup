const authUrl = 'https://fjjjfjdkkjkfjdkj'
const oauth2Client = {
  abc: 123,
  setCredentials: jest.fn(),
  generateAuthUrl: jest.fn(() => authUrl),
  getToken: jest.fn()
}
const SCOPE = ['https://www.googleapis.com/auth/drive.file']
const AUTHCODE = 'fjwejfipwjepfjpwe'
const GoogleOAuth2 = jest.fn(() => oauth2Client)
const { auth } = require('../src/auth')
const rlGood = {
  question: jest.fn(() => Promise.resolve(AUTHCODE)),
  close: jest.fn()
}
const rlBad = {
  question: jest.fn(() => Promise.reject()),
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
    auth({ config, GoogleOAuth2, rl: rlGood })
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
    auth({ config, GoogleOAuth2, rl: rlGood })
      .then(x => {
        expect(oauth2Client.generateAuthUrl).toBeCalledWith({
          access_type: 'offline',
          scope: SCOPE
        })
        done()
      })
  })
  it('outputs url fine', done => {
    auth({ config, GoogleOAuth2, rl: rlGood })
      .then(x => {
        expect(console.log)
          .toBeCalledWith('Go here', authUrl)
        done()
      })
  })
  it('asks code from the user fine', done => {
    const rl = rlGood
    auth({ config, GoogleOAuth2, rl })
      .then(x => {
        expect(rl.question)
          .toBeCalledWith('Enter the code from the page here:')
        expect(oauth2Client.getToken)
          .toBeCalledWith(AUTHCODE)
        expect(rl.close).toBeCalled()
        done()
      })
  })
})
