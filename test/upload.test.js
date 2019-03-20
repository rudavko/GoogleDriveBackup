const { upload } = require('../src/upload')

const auth = {}
jest.spyOn(global.console, 'log')

describe('upload', () => {
  it('returns an error if no auth argument is passed', done => {
    upload()
      .catch(er => {
        expect(er).toEqual(new Error('The upload module did not receive the auth'))
        done()
      })
  })
  it('returns an error if no confit is passed', done => {
    upload({ auth })
      .catch(err => {
        expect(err).toEqual(new Error('The upload module did not receive the config'))
        done()
      })
  })
  it('outputs that the file started uploading', done => {
    const file1 = './cam1/1.mp4'
    upload({ auth, files: [file1], config: {} })
      .then(() => {
        expect(console.log).toBeCalledWith(file1, ' started uploading')
        console.log.mock.calls = []
        done()
      })
  })
  it('outputs that', done => {
    const config = {
      maxConcurrent: 4
    }
    const files = [
      './cam1/1.mp4',
      './cam1/2.mp4',
      './cam1/3.mp4',
      './cam1/4.mp4',
      './cam1/5.mp4'
    ]
    upload({ auth, files, config })
      .then(() => {
        expect(console.log.mock.calls)
          .toEqual([
            [files[0], ' started uploading'],
            [files[1], ' started uploading'],
            [files[2], ' started uploading'],
            [files[3], ' started uploading'],
            [files[4], ' put in queue']])
        done()
      })
  })
})
