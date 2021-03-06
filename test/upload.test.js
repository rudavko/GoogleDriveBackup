const { upload, clearUploading } = require('../src/modules/upload')

beforeEach(() => { clearUploading() })

const auth = {}
const FSREADBODY = { abc: 123 }
global.process.exit = jest.fn()
const log = jest.fn()
const fs = { createReadStream: jest.fn(() => FSREADBODY) }
const create = jest.fn(() => Promise.resolve('good'))
const google = { drive: jest.fn(() => ({ files: { create } })) }
const configGlobal = {
  processExitDelay: 1,
  uploadStartDelay: 10
}
describe('upload', () => {
  it('returns an error if no auth argument is passed', () =>
    upload()
      .catch(er => {
        expect(er)
          .toEqual(new Error('The upload module did not receive the auth'))
      })
  )
  it('returns an error if no config is passed', () =>
    upload({ auth })
      .catch(err => {
        expect(err)
          .toEqual(new Error('The upload module did not receive the config'))
      })
  )
  it('outputs that the file started uploading', () =>
    upload({ auth, files: ['./cam1/1.mp4'], config: configGlobal, fs, google, log })
      .then(() => {
        expect(log).toBeCalledWith('./cam1/1.mp4', 'started uploading')
      })
  )
  it('outputs that first files are uploading and last one is in the queue', () => {
    const config = Object.assign({
      maxConcurrent: 4
    }, configGlobal)

    const files = [
      './cam1/1.mp4',
      './cam1/2.mp4',
      './cam1/3.mp4',
      './cam1/4.mp4',
      './cam1/5.mp4'
    ]
    const log = jest.fn()
    return upload({ auth, files, config, fs, google, log })
      .then(() => {
        expect(log.mock.calls.slice(0, 5))
          .toEqual([
            [files[0], 'started uploading'],
            [files[1], 'started uploading'],
            [files[2], 'started uploading'],
            [files[3], 'started uploading'],
            [files[4], 'put in queue']])
      })
  })
  it('starts file uploads fine', () => {
    const config = Object.assign({
      maxConcurrent: 1
    }, configGlobal)
    const files = [
      './cam1/6.mp4',
      './cam1/7.mp4'
    ]
    const fs2 = { createReadStream: jest.fn(() => FSREADBODY) }
    const log = jest.fn()
    return upload({ auth, config, files, google, fs: fs2, log })
      .then(() => {
        expect(fs2.createReadStream.mock.calls)
          .toEqual([[files[0]], [files[1]]])
        expect(google.drive)
          .toBeCalledWith({ version: 'v3', auth })
        expect(create)
          .toBeCalledWith({ requestBody: { name: '7.mp4' }, media: { body: FSREADBODY } })
      })
  })
  it('logs finished upload fine', done => {
    const config = Object.assign({
      maxConcurrent: 1
    }, configGlobal)
    const files = ['./cam1/7.mp4', './cam1/8.mp4']
    const log = jest.fn()
    upload({ auth, config, files, google, fs, log })
      .then(() => {
        expect(log.mock.calls)
          .toEqual([
            ['./cam1/7.mp4', 'started uploading'],
            ['./cam1/8.mp4', 'put in queue'],
            ['./cam1/7.mp4', 'finished uploading'],
            ['./cam1/8.mp4', 'started uploading'],
            ['./cam1/8.mp4', 'finished uploading'],
            ['All downloads finished. Exiting in 3 seconds']
          ])
        done()
      })
  })
  it('deletes after the upload', done => {
    const create = jest.fn(() => Promise.resolve(true))
    const google = { drive: jest.fn(() => ({ files: { create } })) }
    const config = Object.assign({
      maxConcurrent: 2,
      deleteAfter: true
    }, configGlobal)
    fs.unlinkSync = jest.fn()
    const files = [
      './cam1/7.mp4',
      './cam1/8.mp4',
      './cam1/9.mp4'
    ]
    const log = jest.fn()
    return upload({ auth, config, files, google, fs, log })
      .then(() => {
        expect(log.mock.calls)
          .toEqual([
            ['./cam1/7.mp4', 'started uploading'],
            ['./cam1/8.mp4', 'started uploading'],
            ['./cam1/9.mp4', 'put in queue'],
            ['./cam1/7.mp4', 'finished uploading and was deleted'],
            ['./cam1/9.mp4', 'started uploading'],
            ['./cam1/8.mp4', 'finished uploading and was deleted'],
            ['./cam1/9.mp4', 'finished uploading and was deleted'],
            ['All downloads finished. Exiting in 3 seconds']
          ])
        expect(fs.unlinkSync.mock.calls).toEqual([
          [files[0]],
          [files[1]],
          [files[2]]
        ])
        expect(process.exit).toBeCalled()
        done()
      })
  })
  it('Rejects fine on unlink error', done => {
    const config = Object.assign(configGlobal, {
      maxConcurrent: 1,
      deleteAfter: true
    })
    fs.unlinkSync = jest.fn(() => { throw new Error('Error unlinking the file') })
    const files = ['./cam1/7.mp4', './cam1/8.mp4']
    const log = jest.fn()
    upload({ auth, config, files, google, fs, log })
      .catch(er => {
        expect(er).toEqual(new Error('Error unlinking the file'))
        done()
      })
  })
})
