module.exports = () => ({
  files: [
    'src/**/*.js'
  ],
  tests: [
    'test/**/*test.js'
  ],
  testFramework: 'jest',
  env: {
    type: 'node'
  },
  debug: false
})
