const readline = require('readline')
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
exports.rl = {
  readline: readlineInterface,
  question: text => new Promise((resolve, reject) => {
    readlineInterface.question(text, code => resolve(code))
  })
}
