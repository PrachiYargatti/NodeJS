// # Date after 100 Days from Today

// Given an `app.js` file, write an API with path `/` using express JS to send the date after 100 days from today as a response in `DD/MM/YYYY` format.

// Export the express instance using default export syntax.

// Use the third-party package `date-fns`.

// <b>Use Common JS module syntax</b>.

const addDays = require('date-fns/addDays')
const express = require('express')

const app = express()

app.get('/', (request, response) => {
  let todaysDate = new Date()
  let futureDate = addDays(todaysDate, 100)
  let formattedDate = `${futureDate.getDate()}/${
    futureDate.getMonth() + 1
  }/${futureDate.getFullYear()}`
  response.send(formattedDate)
})

app.listen(3000)

module.exports = app
