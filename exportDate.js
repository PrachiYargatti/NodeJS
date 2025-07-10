
// # Get Date After x Days

// Given an `index.js` file parallel to `README.md` file.
 
// Write a JS function that accepts `days` as an argument and return the date after given number of `days` from <b>22nd Aug 2020</b> using the `date-fns` package.

// Export the function using the default export syntax.

// <b>Date Format</b>

// DD-MM-YYYY

// <b>Use Common JS module syntax</b>.


const {addDays} = require('date-fns')

function returnDate(days) {
  const date = addDays(new Date(2020, 7, 22), days)
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}

// console.log(returnDate(5))
module.exports = returnDate
