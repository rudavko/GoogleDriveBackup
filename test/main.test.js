const main = require('../src/main')

it('test itself', () => {
  expect(true).toEqual(true)
})

describe('basics', () => {
  it('Returns an error if the configs are empty', () => {
    expect.assertions(1)
    const getConfig = () => Promise.reject(new Error('The config is empty'))
    main.launch({ getConfig })
      .catch(x =>
        expect(x)
          .toEqual(new Error('The config is empty'))
      )
  })
  it('Returns an error if the auth has failed', done => {
    expect.assertions(1)
    const getConfig = () => Promise.resolve()
    const getAuth = () => Promise.reject(new Error('The auth has failed'))
    main.launch({ getConfig, getAuth })
      .catch(x => {
        expect(x)
          .toEqual(new Error('The auth has failed'))
        done()
      })
  })
  it('Errors out if upload has failed', done => {
    const getConfig = () => Promise.resolve()
    const getAuth = () => Promise.resolve()
    const upload = () => Promise.reject(new Error('The upload has failed'))

    main.launch({ getConfig, getAuth, upload })
      .catch(x => {
        expect(x)
          .toEqual(new Error('The upload has failed'))
        done()
      })
  })
})
