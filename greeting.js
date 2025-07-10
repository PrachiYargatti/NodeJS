// Greeting Message
// Create a new file index.js in the message directory.

// Write a JS program to export the string Hello Rahul! Have a Great Day using the message from greeting/index.js.

// Export the template string using the default export syntax.

// Use Common JS module syntax.

module.exports = 'Have a Great Day'

const message = require('../greeting/index.js')

const resultString = `Hello Rahul! ${message}`

module.exports = resultString
