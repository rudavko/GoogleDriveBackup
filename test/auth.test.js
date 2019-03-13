const driveMock = {
  files: {
    list: jest.fn()
  }
}
const google = {
  auth: {
    OAuth2: jest.fn()
  },
  drive: jest.fn(driveMock)
}
const { auth } = require('../src/auth')

describe('general tests', () => {
  it('checks config', done => {
    auth()
      .catch(x => {
        expect(x).toEqual(new Error('No config specified'))
        done()
      })
  })
})
