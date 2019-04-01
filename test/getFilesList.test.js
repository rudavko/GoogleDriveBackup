const { getFilesList } = require('../src/modules/getFilesList')
const flatten = require('array-flatten')
describe('Gets a list of all files in all foldels from config',
  () => {
    it('returns an error if the config is empty', done => {
      getFilesList({})
        .catch(er => {
          expect(er).toEqual(new Error('The config is empty'))
          done()
        })
    })
    it('gets all files from folder', done => {
      const config = {
        folders: [
          './cam1',
          './cam2'
        ]
      }
      const fs = {
        readdirSync: jest.fn(path => {
          if (path === './cam1') return ['vid1.mp4', 'vid2.mp4']
          if (path === './cam2') return ['vid3.mp4', 'vid4.mp4']
        }),
        existsSync: jest.fn(() => true)
      }
      getFilesList({ fs, config, flatten })
        .then(files => {
          expect(fs.existsSync.mock.calls)
            .toEqual([['./cam1'], ['./cam2']])
          expect(files)
            .toEqual(['./cam1/vid1.mp4', './cam1/vid2.mp4', './cam2/vid3.mp4', './cam2/vid4.mp4'])
          done()
        })
    })
  })
