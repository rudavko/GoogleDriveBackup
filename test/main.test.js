const main = require('../src/main')

it('test itself', () => {
  expect(true).toEqual(true)
})

describe('basics', () => {
  it('Returns an error if the configs are empty', () => {
    const getConfig = () => {
      throw new Error('The config is empty')
    }
    expect(() => main.launch({ getConfig }))
      .toThrow(new Error('The config is empty'))
  })
  it('Returns an error if the auth has failed', () => {
    const getConfig = jest.fn()
    const getAuth = () => {
      throw new Error('The auth has failed')
    }
    expect(() => main.launch({ getConfig, getAuth }))
      .toThrow(new Error('The auth has failed'))
  })
  it('Errors out if upload has failed', () => {
    const getConfig = jest.fn()
    const getAuth = jest.fn()
    const upload = () => {
      throw new Error('The upload has failed')
    }
    expect(() => { main.launch({ getConfig, getAuth, upload }) })
      .toThrow(new Error('The upload has failed'))
  })
})
