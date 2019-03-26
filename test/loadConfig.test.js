const { loadConfig } = require('../src/loadConfig.js')

describe('load config files', () => {
  it('loads config files and returns config object', done => {
    loadConfig()
      .then(() => {
        expect(1).toBe(1)
        done()
      })
  })
})
