// # Gadgets Page

// Given two files `app.js` and `gadgets.html`, write an API in `app.js` file for the path `/gadgets` that sends the `gadgets.html` file as a response.

// Export the express instance using default export syntax.

// <b>Use Common JS module syntax</b>.

//gadgets.html
<!doctype html>
<html>
  <body>
    <h1>Gadgets</h1>
    <p>A gadget is a mechanical device or any ingenious article.</p>
  </body>
</html>

const express = require('express')
const app = express()

app.get('/gadgets', (request, response) => {
  response.sendFile('./gadgets.html', {root: __dirname})
})

app.listen(3000)

module.exports = app
